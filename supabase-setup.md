# EL PLAZA — 자체 데이터베이스(Supabase) 연동 가이드

구글에 의존하지 않고 **사장님 소유의 데이터베이스**에 신청 내역을 모으는 방법입니다.
Supabase는 무료 PostgreSQL 데이터베이스 + 표 형태로 보는 대시보드를 제공합니다.

> 정적 사이트라 서버 코드는 없습니다. 브라우저가 Supabase에 **직접** 데이터를 넣되,
> 보안정책(RLS)으로 **입력(INSERT)만 허용**하고 **조회는 막아** 개인정보를 보호합니다.
> (신청 내역 조회는 로그인한 관리자만 Supabase 대시보드에서 가능)

---

## 1. 프로젝트 만들기 (약 2분)
1. https://supabase.com 가입 → **New project** 생성
   - Name: `elplaza` (아무거나)
   - Database Password: 적당히 설정 후 메모
   - Region: `Northeast Asia (Seoul)` 권장
2. 생성 완료까지 1~2분 대기.

## 2. 테이블 만들기 (SQL 한 번 실행)
좌측 메뉴 **SQL Editor → New query** 에 아래를 붙여넣고 **Run**:

```sql
-- 신청 내역 테이블
create table public.submissions (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  form_type   text,          -- '이용신청서' 또는 'B2B제휴문의'
  name        text,          -- 성명 / 담당자
  phone       text,          -- 연락처
  program     text,          -- (이용신청서) 신청 프로그램
  birth       text,          -- (이용신청서) 생년월일
  signdate    text,          -- (이용신청서) 작성일자
  company     text,          -- (B2B) 회사/단체명
  partner_type text,         -- (B2B) 파트너 유형
  memo        text           -- (B2B) 문의 내용
);

-- 보안: RLS 켜기
alter table public.submissions enable row level security;

-- 익명 방문자는 "입력만" 가능 (조회/수정/삭제 불가)
create policy "anon can insert" on public.submissions
  for insert to anon
  with check (true);
```

> 이 정책 덕분에 웹사이트 방문자는 신청서를 넣을 수만 있고,
> 다른 사람의 신청 내역을 읽을 수는 없습니다. (조회는 관리자 대시보드 전용)

## 3. 연결 키 복사
좌측 **Project Settings(⚙️) → API** 화면에서:
- **Project URL** (예: `https://abcd1234.supabase.co`)
- **anon public** 키 (긴 문자열)

두 값을 복사합니다. (anon 키는 공개되어도 되는 키입니다 — 위 RLS 정책이 보호함)

## 4. 사이트에 연결
`assets/app.js` 상단을 아래처럼 채웁니다:

```js
window.SUPABASE_URL = 'https://abcd1234.supabase.co';  // 복사한 Project URL
window.SUPABASE_ANON_KEY = 'eyJhbGciOi...';            // 복사한 anon public 키
```

저장 후 `git push` 하면 Vercel이 자동 배포 → 끝.

---

## 신청 내역 보는 곳 (관리자)
Supabase 대시보드 좌측 **Table Editor → submissions** 에서
접수된 신청이 표로 한 줄씩 쌓입니다.
- 필터/정렬로 `이용신청서` / `B2B제휴문의` 구분해 보기
- 우측 상단 **Export → CSV** 로 엑셀 다운로드(로컬 백업) 가능

---

# 관리자 화면(admin.html)에서 신청 내역 보기

`admin.html` 은 **로그인한 관리자만** 신청 내역을 표로 보고 CSV로 내려받는 페이지입니다.
주소: `https://elplaza.vercel.app/admin.html`
작동시키려면 아래 3가지를 1회 설정하세요.

## A. 읽기 권한 정책 추가 (SQL 1회)
SQL Editor → New query 에 붙여넣고 Run:

```sql
-- 로그인한 관리자는 신청 내역을 조회(SELECT)할 수 있다
create policy "authenticated can read" on public.submissions
  for select to authenticated using (true);
```

## B. 공개 회원가입 끄기 (보안 — 중요)
이걸 꺼야 아무나 계정을 만들어 데이터를 보는 것을 막습니다.
**Authentication → Sign In / Providers → Email** 에서
**"Allow new users to sign up"(신규 가입 허용)** 토글을 **끔(off)** 으로.

## C. 관리자 계정 만들기
**Authentication → Users → Add user → Create new user** 에서
- Email: 관리자가 로그인에 쓸 이메일 (예: admin@elplaza.com)
- Password: 비밀번호 설정
- (Auto Confirm User 체크)

→ 이제 `admin.html` 에 그 이메일/비밀번호로 로그인하면 신청 내역이 보입니다.

## 관리자 화면 기능
- 전체 / 이용신청서 / B2B 탭으로 구분해서 보기
- **CSV 내보내기** 버튼 → 현재 보는 목록을 PC에 파일로 저장(로컬 백업)
- 새로고침 / 로그아웃

---

## 참고 / 보안
- anon 키는 웹에 노출되지만, RLS가 입력만 허용하므로 데이터 유출 위험은 없습니다.
  (조회는 로그인한 관리자만 — 위 A·B·C 설정 기준)
- 누군가 장난 입력을 대량으로 넣는 게 걱정되면, 나중에 reCAPTCHA나
  간단한 honeypot 필드를 추가할 수 있습니다 (현재 트래픽 규모면 불필요).
- 구글 시트 연동(`google-apps-script.gs`)과 **동시 사용도 가능**합니다.
  둘 다 채워두면 신청 시 시트와 DB 양쪽에 모두 기록됩니다.
