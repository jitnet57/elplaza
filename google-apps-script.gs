/* ============================================================
   EL PLAZA — 신청서 → 구글 시트 수집 (Google Apps Script)
   ------------------------------------------------------------
   이 코드는 웹사이트의 두 폼(이용신청서 / B2B 제휴문의)에서
   넘어온 데이터를 구글 스프레드시트에 자동으로 한 줄씩 기록합니다.

   ▶ 설치 방법은 이 파일 맨 아래 [설치 가이드] 참고
   ============================================================ */

// (선택) 신청이 들어올 때마다 알림 메일을 받을 주소.
// 비워두면 메일 발송 없이 시트에만 기록됩니다.
var NOTIFY_EMAIL = '';

// 폼 유형별 시트(탭) 이름과 열 제목
var SHEETS = {
  '이용신청서':   ['접수시각', '신청 프로그램', '성명', '연락처', '생년월일', '작성일자'],
  'B2B제휴문의': ['접수시각', '회사/단체명', '담당자', '연락처', '파트너유형', '문의내용']
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // 동시 제출 시 줄 꼬임 방지

    var data = JSON.parse(e.postData.contents);
    var type = data.formType || '기타';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(type);

    // 해당 탭이 없으면 만들고 제목 줄 추가
    if (!sheet) {
      sheet = ss.insertSheet(type);
      if (SHEETS[type]) {
        sheet.appendRow(SHEETS[type]);
        sheet.getRange(1, 1, 1, SHEETS[type].length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
    }

    var now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    var row;
    if (type === '이용신청서') {
      row = [now, data.program || '', data.name || '', data.phone || '', data.birth || '', data.signdate || ''];
    } else if (type === 'B2B제휴문의') {
      row = [now, data.company || '', data.name || '', data.phone || '', data.type || '', data.memo || ''];
    } else {
      row = [now, JSON.stringify(data)];
    }
    sheet.appendRow(row);

    // (선택) 알림 메일
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: '[EL PLAZA] 새 ' + type + ' 접수 — ' + (data.name || ''),
        body: '접수시각: ' + now + '\n\n' + row.join('\n')
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 브라우저로 URL을 직접 열었을 때 동작 확인용
function doGet() {
  return ContentService.createTextOutput('EL PLAZA form endpoint is running.');
}

/* ============================================================
   [설치 가이드]
   ------------------------------------------------------------
   1. https://sheets.google.com 에서 새 스프레드시트를 만든다.
      (이름 예: "EL PLAZA 신청 접수")
   2. 상단 메뉴 [확장 프로그램] → [Apps Script] 클릭.
   3. 기본 Code.gs 내용을 모두 지우고, 이 파일 내용을 전부 붙여넣는다.
      (메일 알림을 원하면 위 NOTIFY_EMAIL 에 받을 주소를 적는다.)
   4. 저장(💾) 후, 우측 상단 [배포] → [새 배포] 클릭.
   5. 유형 선택(⚙️) → [웹 앱] 선택.
        - 설명: 아무거나
        - 실행 사용자(Execute as): "나(본인 계정)"
        - 액세스 권한(Who has access): "모든 사용자(Anyone)"
   6. [배포] → 권한 승인(본인 구글 계정 허용) 진행.
   7. 나오는 [웹 앱 URL] (.../exec 로 끝남) 을 복사한다.
   8. 그 URL을 웹사이트의 assets/app.js 상단
        window.GSHEET_ENDPOINT = '여기에 붙여넣기';
      에 넣고 저장 → git push 하면 끝.

   ※ 이후 코드를 수정하면 [배포] → [배포 관리] → 기존 배포 [편집]
     → 버전 "새 버전" 선택 후 [배포] 해야 반영됩니다. (URL은 그대로 유지)
   ============================================================ */
