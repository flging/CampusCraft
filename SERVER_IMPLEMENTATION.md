# CampusCraft 서버 구현 & 운영 기술 문서

> 동시접속 50~200명 중규모 대학생 마인크래프트 서버 기술 가이드

---

## 1. 서버 인프라 & 호스팅

### 1.1 권장 스펙

| 항목 | 최소 (50명) | 권장 (100명) | 확장 (200명) |
|------|-------------|--------------|--------------|
| RAM | 8 GB | 12 GB | 16 GB |
| vCPU | 4 코어 | 4~6 코어 | 6~8 코어 |
| 스토리지 | 50 GB SSD | 100 GB NVMe | 200 GB NVMe |
| 네트워크 | 1 Gbps | 1 Gbps | 1 Gbps |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

> Paper 1.21 기준 플레이어당 약 40~80MB RAM 소모. OS + JVM 오버헤드 2~3GB 별도 필요.

### 1.2 호스팅 후보 비교

| 호스팅 | 스펙 | 월 비용 | 리전 | 비고 |
|--------|------|---------|------|------|
| **Oracle Cloud Free Tier** | 4 OCPU / 24 GB ARM | 무료 | 서울 (춘천) | Always Free. ARM이라 일부 플러그인 호환 확인 필요 |
| **Naver Cloud (NCloud)** | 4 vCPU / 16 GB | ~8만원 | 서울 | 국내 레이턴시 최저. 크레딧 프로그램 가능성 |
| **Contabo VPS** | 6 vCPU / 16 GB | ~€12 (~1.7만원) | 일본 도쿄 | 가성비 최강. 도쿄 리전으로 한국 핑 30~50ms |
| **Hetzner Cloud** | 4 vCPU / 16 GB (CCX23) | ~€24 (~3.3만원) | 핀란드/독일 | 유럽 리전만 존재. 핑 200ms+ (비추) |
| **Cafe24 Game** | 전용 게임 서버 | ~5만원 | 서울 | 관리형. 커스텀 자유도 낮음 |

### 1.3 권장 전략

/////// 생략

### 1.4 도메인 & DNS 설정

서버 주소: `campuscraft.xyz`

```
; A 레코드 — 서버 IP 직접 연결
campuscraft.xyz.    A    <서버_IP>

; SRV 레코드 — 포트 없이 접속 가능하게
_minecraft._tcp.campuscraft.xyz.    SRV    0 5 25565 campuscraft.xyz.

; BE 전용 서버 오픈 시 (별도 서버)
_bedrock._udp.be.campuscraft.xyz.    SRV    0 5 19132 be.campuscraft.xyz.
```

### 1.5 JVM 튜닝 (Aikar's Flags)

```bash
java -Xms10G -Xmx10G \
  -XX:+UseG1GC \
  -XX:+ParallelRefProcEnabled \
  -XX:MaxGCPauseMillis=200 \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+DisableExplicitGC \
  -XX:+AlwaysPreTouch \
  -XX:G1NewSizePercent=30 \
  -XX:G1MaxNewSizePercent=40 \
  -XX:G1HeapRegionSize=8M \
  -XX:G1ReservePercent=20 \
  -XX:G1HeapWastePercent=5 \
  -XX:G1MixedGCCountTarget=4 \
  -XX:InitiatingHeapOccupancyPercent=15 \
  -XX:G1MixedGCLiveThresholdPercent=90 \
  -XX:G1RSetUpdatingPauseTimePercent=5 \
  -XX:SurvivorRatio=32 \
  -XX:+PerfDisableSharedMem \
  -XX:MaxTenuringThreshold=1 \
  -jar paper-1.21.jar --nogui
```

> `-Xms`와 `-Xmx`를 동일하게 설정하여 GC 오버헤드 최소화. 가용 RAM의 60~70%를 할당.

---

## 2. Lands 플러그인 통합

### 2.1 Lands 선택 이유

| 기준 | Lands | Towny | WorldGuard |
|------|-------|-------|------------|
| 청크 기반 영토 | O | O | X (커스텀 영역) |
| API 완성도 | 매우 높음 (이벤트 풍부) | 보통 | 높음 |
| 성능 (100명+) | 최적화 우수 | 무거움 | 가벼움 |
| GUI 지원 | 내장 GUI | 없음 | 없음 |
| 전쟁 시스템 | 내장 | 내장 | 없음 |
| 가격 | $24.95 (1회) | 무료 | 무료 |
| 유지보수 | 활발 (1.21 즉시 지원) | 느림 | 활발 |

Lands는 청크 기반 영토 + 풍부한 API + 내장 전쟁 시스템을 제공하여 대학 컨텐츠 컨셉에 가장 적합하다.

### 2.2 CampusCraft ↔ Lands API 연동 구조

```
┌────────────────────┐      Lands API       ┌─────────────────┐
│  CampusCraft Core  │◄────────────────────►│   Lands Plugin   │
│                    │                       │                  │
│  - WhitelistMgr    │  LandsBridge 모듈     │  - Land 관리      │
│  - TeamManager     │◄──────────────────►  │  - Chunk Claim   │
│  - GwajamManager   │                       │  - Trust 관리     │
│  - UniversityMgr   │                       │  - 전쟁 시스템     │
└────────────────────┘                       └─────────────────┘
         ▲                                            ▲
         │              이벤트 리스닝                    │
         └────────────────────────────────────────────┘
           LandCreateEvent, PlayerTrustEvent 등
```

### 2.3 대학교별 자동 Land 생성

플레이어가 서버에 최초 접속 시:

1. `PlayerJoinListener`에서 대학교 태그 확인 (e.g. `SNU`)
2. 해당 대학교 Land가 존재하는지 Lands API로 조회
3. 없으면 → 자동 생성 (Land 이름: `{university_tag}`, 예: `SNU`)
4. 있으면 → 해당 Land에 플레이어를 `MEMBER` 역할로 trust

```java
// 의사 코드 — LandsBridge 모듈
LandsIntegration landsApi = LandsIntegration.of(plugin);

// 대학 Land 조회 또는 생성
Land universityLand = landsApi.getLandByName(universityTag);
if (universityLand == null) {
    universityLand = landsApi.createLand(
        player.getUniqueId(),  // 최초 접속자가 임시 owner
        universityTag,
        spawnLocation
    );
}

// 팀원 자동 trust
universityLand.trustPlayer(player.getUniqueId(), TrustLevel.MEMBER);
```

### 2.4 점수 기반 영토 확장 (확장 형식으로 할지, 원하는 청크를 개인이 구매하는 형식으로 할 지 정해야 함)

| 대학 총 점수 | 추가 Claim 청크 수 | 누적 최대 |
|-------------|-------------------|----------|
| 0 ~ 999 | 9 (기본 3×3) | 9 |
| 1,000 | +7 | 16 (4×4) |
| 5,000 | +9 | 25 (5×5) |
| 15,000 | +11 | 36 (6×6) |
| 30,000 | +13 | 49 (7×7) |
| 50,000 | +15 | 64 (8×8) |
| 100,000 | +17 | 81 (9×9) |
| 200,000+ | +19 | 100 (10×10) |

```java
// 점수 변동 시 Lands claim 한도 조정
public void updateClaimLimit(String universityTag, int totalScore) {
    Land land = landsApi.getLandByName(universityTag);
    int maxChunks = calculateMaxChunks(totalScore);
    land.setMaxChunks(maxChunks);
}
```

### 2.5 초기 스폰 영역 배치 전략

**사전등록 선착순 부지 선택 방식:**

운영진이 맵에 미리 여러 부지를 등록해두고, 사전등록 후 서버에 입장한 대학교의 대표가 **선착순으로 원하는 부지를 선택**하는 방식.

```
부지 선택 플로우:
1. 운영진이 맵 내 부지 후보를 사전 등록 (방사형 배치, 균등 거리)
2. 사전등록한 유저가 서버 입장
3. 해당 대학의 첫 입장자(대표)가 미선점 부지 목록에서 선택
4. 선택 완료 → 해당 부지가 대학 Land로 확정
5. 이후 같은 대학 유저는 해당 Land에 자동 배정
```

- 사전등록으로 먼저 들어온 대학이 좋은 위치를 선점할 수 있어 사전등록 유인 효과
- 대학 간 최소 거리: 2000블록 (최적의 값으로 조정 필요)
- 초기 청크 클레임: 3×3 (48×48 블록)
- `Chunky`로 사전 청크 생성 → 접속 시 렉 방지

---

## 3. 직접 개발 플러그인

### 3.1 CampusCraft Core (기존 — 완성)

> 패키지: `xyz.campuscraft.plugin` | Paper 1.21 | Java 21

| 모듈 | 클래스 | 기능 |
|------|--------|------|
| **화이트리스트** | `WhitelistManager`, `WhitelistSyncTask` | Supabase 5분 주기 동기화, 미인증 유저 킥 |
| **팀 배정** | `TeamManager` | 이메일 도메인 기반 스코어보드 팀 자동 배정 |
| **과잠 시스템** | `GwajamManager`, `GwajamProtectListener` | 대학 디자인 다이아 갑옷 지급, 탈착/드롭/이동 방지 (사전등록자 커스터마이징 가능) |
| **채팅** | `PlayerChatListener`, `TeamChatCommand` | `[대학태그] 닉네임` 형식, `/tc`로 팀 전용 채팅 |
| **대학 DB** | `UniversityManager`, `UniversityInfo` | 30개 대학 정보 (태그, 이름, 도메인, 색상) |
| **설정** | `PluginConfig` | Supabase URL/키, 동기화 간격 등 |
| **명령어** | `CampusCraftCommand` | `/cc sync`, `/cc reload` 등 관리 명령어 |

### 3.2 CampusCraft Lands Bridge (신규)


> Lands API와 Core 플러그인을 연결하는 브릿지 모듈

**주요 기능:**
- 대학교별 Land 자동 생성/관리
- 신규 접속 플레이어 자동 trust
- 점수 기반 영토 확장 한도 조정
- Land 이벤트 리스닝 (침입, 전쟁 등)

**의존성:**
```gradle
compileOnly("me.angeschossen:LandsAPI:7.x.x")
```

**이벤트 처리:**
| Lands 이벤트 | 처리 로직 |
|-------------|----------|
| `LandCreateEvent` | 대학 Land 초기 설정 적용 |
| `LandTrustPlayerEvent` | 대학 소속 검증 |
| `LandInvadeEvent` | 전쟁 로그 기록, 점수 반영 |
| `ChunkClaimEvent` | 청크 한도 체크 |

### 3.3 CampusCraft Department (신규)

> 대학별 학과 칭호 시스템

**학과 목록 관리:**
- 대학교별 학과 목록을 사전 조사하여 DB에 등록
- 플레이어는 소속 대학의 학과 목록에서 **선택**하여 설정 (자유 입력 불가)
- `/department` — 소속 대학 학과 목록 GUI 표시, 선택
- `/department toggle` — 닉네임 위 학과 표시 on/off

**표시 방식:**
- **기본:** `[SNU] 닉네임` (대학 태그 + 닉네임)
- **학과 on:** 닉네임 위에 학과명 별도 표시 (머리 위 네임태그)
- TAB 플러그인 연동: 탭 리스트에도 학과 표시 (on 상태일 때)

**DB 스키마 추가:**

```sql
-- 대학별 학과 목록
CREATE TABLE university_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_tag VARCHAR NOT NULL,
    department_name VARCHAR NOT NULL,
    UNIQUE(university_tag, department_name)
);

-- 플레이어 학과 설정
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    minecraft_nickname VARCHAR NOT NULL UNIQUE,
    university_tag VARCHAR NOT NULL,
    department VARCHAR REFERENCES university_departments(department_name),
    department_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### 3.4 CampusCraft Score (신규)

> 자원 교환 기반 점수 시스템 + 리더보드 + 시즌제

**점수 획득 방식: 자원 → 점수 교환**

자동 점수 부여가 아닌, 플레이어가 **직접 자원을 NPC/명령어에 납품하여 점수로 교환**하는 방식.

| 교환 자원 | 점수/개 | 비고 |
|----------|---------|------|
| 다이아몬드 | 1점 | 기본 교환 자원 |
| 네더라이트 주괴 | 10점 | 고급 교환 자원 |

**교환 인터페이스:**
- `/deposit` — 손에 든 자원을 점수로 교환 (인벤토리에서 자원 차감)
- `/deposit all` — 인벤토리 내 교환 가능 자원 일괄 납품
- 스폰 NPC (선택) — 우클릭으로 교환 GUI 오픈

**교환 플로우:**
```
1. 플레이어가 다이아몬드/네더라이트 수집
2. /deposit 명령어 또는 교환 NPC 이용
3. 인벤토리에서 자원 차감 → 개인 점수 증가
4. 개인 점수 합산 → 소속 대학 총점에 반영
5. 대학 순위 리더보드 갱신
```

**핵심 구현:**
- `PlayerCommandPreprocessEvent`로 `/deposit` 처리
- 인벤토리 내 자원 수량 확인 → 차감 → 점수 DB 반영
- 인메모리 캐시 + 5분 주기 Supabase 배치 저장
- 개인 점수 합산 → 대학교 총점 자동 집계
- `/score` — 개인 점수 확인
- `/rank` — 대학교 순위 리더보드 (Top 10)
- 시즌제: 4주 단위 리셋, 역대 시즌 기록 보존

**안티 어뷰징:**
- 교환 쿨다운: 1분당 최대 1회 교환
- 자원 복제 버그 대응: CoreProtect 로그 크로스체크
- 비정상적 대량 교환 감지 시 관리자 알림

**DB 스키마 추가:**

```sql
-- 개인 점수
CREATE TABLE player_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    minecraft_nickname VARCHAR NOT NULL,
    university_tag VARCHAR NOT NULL,
    season INT NOT NULL DEFAULT 1,
    score BIGINT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT now(),
    UNIQUE(minecraft_nickname, season)
);

-- 대학 순위 (materialized view)
CREATE MATERIALIZED VIEW university_rankings AS
SELECT
    university_tag,
    SUM(score) AS total_score,
    COUNT(*) AS player_count,
    RANK() OVER (ORDER BY SUM(score) DESC) AS rank
FROM player_scores
WHERE season = (SELECT MAX(season) FROM player_scores)
GROUP BY university_tag;
```

### 3.5 CampusCraft Web API (신규 — 선택)

> 웹 대시보드/외부 서비스용 REST API

**기술:** 플러그인 내장 경량 HTTP 서버 (Javalin 또는 Spark) 또는 별도 Spring Boot 서비스

**엔드포인트:**

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/rankings` | 대학 순위 리더보드 |
| GET | `/api/rankings/{tag}` | 특정 대학 상세 |
| GET | `/api/players/{nickname}` | 개인 통계 |
| GET | `/api/season/current` | 현재 시즌 정보 |
| GET | `/api/server/status` | 서버 상태 (온라인 수, TPS) |

**보안:** API Key 인증 헤더 + Rate Limiting (60 req/min)

---

## 4. 서드파티 플러그인 목록

### 4.1 필수 플러그인

| 플러그인 | 버전 | 용도 | 비고 |
|----------|------|------|------|
| **Lands** | 7.x | 영토/청크 관리, 전쟁 시스템 | 유료 ($24.95), SpigotMC |
| **EssentialsX** | 2.20+ | 기본 명령어 (`/tpa`, `/home`, `/spawn` 등) | 무료 |
| **LuckPerms** | 5.4+ | 권한 관리 (그룹: default, moderator, admin) | 무료 |
| **CoreProtect** | 22+ | 블록 로그/롤백 (그리핑 대응) | 무료 |

### 4.2 권장 플러그인

| 플러그인 | 용도 | 비고 |
|----------|------|------|
| **Spark** | 성능 프로파일링, TPS/MSPT 모니터링 | 무료. 서버 최적화 필수 도구 |
| **ViaVersion** | 하위 버전 클라이언트 호환 (1.20.x → 1.21) | 무료 |
| **Chunky** | 월드 사전 생성 (청크 프리로드) | 무료. 초기 세팅 시 필수 |
| **TAB** | 탭 리스트 커스텀 (대학 태그 표시) | 무료 |
| **DiscordSRV** | 디스코드 ↔ 서버 채팅 브릿지 | 무료 |

---

## 5. BE(Bedrock Edition) 전용 서버 검토

> JE 서버와 통합(Geyser)이 아닌, **별도 BE 전용 서버**를 추후 구축하는 방향

### 5.1 왜 통합이 아닌 별도 서버인가

| 항목 | Geyser 통합 | BE 전용 서버 |
|------|------------|-------------|
| 과잠/커스텀 아이템 | BE에서 표시 불일치 | BE 네이티브로 완벽 구현 |
| 전투 밸런스 | JE/BE 혼합 시 불공정 | 각 에디션에 맞춘 밸런싱 |
| 플러그인 호환성 | 일부 플러그인 BE 미지원 | BE 전용 애드온/플러그인 사용 |
| 유지보수 복잡도 | Geyser 업데이트 의존 | 독립 관리, 단순 |
| 유저 경험 | 변환 과정에서 미세 이질감 | 네이티브 BE 경험 |

### 5.2 BE 전용 서버 구상

**서버 소프트웨어 후보:**

| 소프트웨어 | 언어 | 비고 |
|-----------|------|------|
| **Nukkit / PowerNukkitX** | Java | JE 플러그인 경험 재활용 가능 |
| **PocketMine-MP** | PHP | BE 커뮤니티 최대, 플러그인 풍부 |
| **Dragonfly** | Go | 고성능, 비교적 신생 |

**아키텍처:**

```
┌──────────────────────┐          ┌──────────────────────┐
│    JE 서버 (Paper)    │          │   BE 서버 (별도)       │
│    campuscraft.xyz    │          │   be.campuscraft.xyz  │
│    TCP 25565          │          │   UDP 19132           │
│                       │          │                       │
│  CampusCraft Core     │          │  CampusCraft BE Core  │
│  Lands, Score 등      │          │  BE 전용 플러그인       │
└──────────┬───────────┘          └──────────┬───────────┘
           │                                  │
           └──────────┬───────────────────────┘
                      ▼
              ┌──────────────┐
              │  Supabase DB  │  ← 공유 DB (인증, 점수, 순위)
              │  (PostgreSQL)  │
              └──────────────┘
```

- JE/BE 서버가 동일 Supabase DB를 공유하여 인증/점수/순위 통합
- 서버 간 채팅 브릿지는 디스코드 허브로 대체

### 5.3 도입 시기

| 단계 | 시기 | 조건 |
|------|------|------|
| **현재** | 런칭~안정화 | **JE Only.** 핵심 기능 완성 및 안정화 집중 |
| **검토 시작** | 런칭 후 3개월+ | JE 서버 안정 운영 확인 + BE 수요 조사 |
| **개발 착수** | 런칭 후 6개월+ | BE 수요 확인 시 별도 서버 개발 시작 |
| **BE 오픈** | 런칭 후 9개월+ | BE 전용 서버 오픈 베타 |

### 5.4 BE 수요 판단 기준

- 사전등록 시 "BE(모바일/콘솔)로 플레이하고 싶다" 설문 항목 추가
- 디스코드/에브리타임에서 BE 관련 문의 빈도
- 대학생 모바일 게임 이용률 트렌드
- BE 유저 요청이 전체의 20% 이상 시 개발 착수 검토

### 5.5 모바일 유저 비중 예측

| 시기 | JE : BE 비율 | 근거 |
|------|-------------|------|
| 런칭~3개월 | 100 : 0 | JE Only |
| 6~9개월 | 80 : 20 | BE 서버 오픈 시 초기 유입 |
| 1년+ | 60 : 40 | 대학생 모바일 접근성, 홍보 효과 확대 |

---

## 6. 인원수 예측 & 스케일링

### 6.1 단계별 목표

| 단계 | 시기 | 사전등록 | 동시접속 | MAU | 마일스톤 |
|------|------|---------|---------|-----|---------|
| **Soft Launch** | 1~2주차 | 100~200 | 10~30 | 50 | 핵심 기능 검증, 버그 수정 |
| **Open Beta** | 3~4주차 | 500~800 | 30~60 | 200 | 에브리타임 바이럴 시작 |
| **Growth** | 2~3개월 | 1,000~2,000 | 60~120 | 500 | 크리에이터 협업 효과 |
| **Scale** | 4~6개월 | 3,000~5,000 | 100~200 | 1,000 | BE 지원, 대학 확대 |
| **Mature** | 6개월+ | 5,000+ | 150~300 | 2,000+ | 멀티 서버 검토 |

### 6.2 서버 스케일링 기준

| 지표 | 임계값 | 대응 |
|------|--------|------|
| TPS (Ticks Per Second) | < 18 (정상: 20) | Spark 프로파일링 → 병목 분석 |
| MSPT (ms/tick) | > 50ms | 엔티티/레드스톤 제한, view-distance 축소 |
| 동시접속 | > 150명 상시 | RAM 증설 (16GB → 32GB) |
| 동시접속 | > 250명 상시 | Velocity 프록시 + 멀티 서버 전환 |
| 디스크 I/O | 높은 지연 | NVMe SSD 확인, 월드 저장 간격 조정 |
| 네트워크 | 패킷 로스 > 1% | 호스팅 변경 또는 DDoS 방어 설정 |

### 6.3 멀티 서버 전환 (250명+)

```
┌──────────────────┐
│  Velocity Proxy   │ ← 플레이어 접속 진입점
│  (포트 25565)      │
└──────┬───────────┘
       │
  ┌────┴─────┬──────────┐
  ▼          ▼          ▼
┌──────┐  ┌──────┐  ┌──────┐
│ 로비  │  │ 월드1 │  │ 월드2 │
│서버   │  │(서울권)│  │(지방권)│
└──────┘  └──────┘  └──────┘
```

- Velocity를 프록시로, 서버를 대학 권역별로 분리
- 크로스 서버 점수 동기화: Supabase(중앙 DB) + Redis(실시간 캐시)
- 필요 시점: 동시접속 250명 이상 지속 시

### 6.4 주요 server.properties 튜닝

```properties
# 기본 성능 튜닝
view-distance=8
simulation-distance=5
max-players=200
network-compression-threshold=256

# 엔티티 제한
spawn-limits.monsters=50
spawn-limits.animals=8
spawn-limits.water-animals=3
spawn-limits.ambient=1

# Paper 전용 (paper-global.yml)
# chunk-loading.max-concurrent-sends: 2
# chunk-loading.autoconfig-send-distance: true
```

---

*마지막 업데이트: 2026-02-24*
