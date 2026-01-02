import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudyCreatePage.css";
// import { createStudy } from "../../api/studies";

const MAX_STUDY_NAME = 20;
const MAX_DESC = 200;
const MAX_RULES = 200;

// 서버로 보낼 enum 값 + 화면 표시 라벨 분리
const CATEGORY_OPTIONS = [
  { label: "수능", value: "CSAT" },
  { label: "공무원", value: "CIVIL_SERVICE" },
  { label: "임용", value: "TEACHER_EXAM" },
  { label: "자격증", value: "CERTIFICATE" },
  { label: "어학", value: "LANGUAGE" },
  { label: "취업", value: "EMPLOYMENT" },
  { label: "기타", value: "ETC" },
] as const;

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"];
type Visibility = "public" | "private";

export default function StudyCreatePage() {
  const navigate = useNavigate();

  // coverImage: 나중에 파일 업로드로 바뀔 예정 → 지금은 URL 임시
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // 명세: studyName
  const [studyName, setStudyName] = useState("");

  // 명세: category(enum)
  const [category, setCategory] = useState<CategoryValue>("CSAT");

  // 명세: description
  const [description, setDescription] = useState("");

  // (명세에 rules 필드가 없을 수도 있어서) UI용으로 유지 + payload에는 일단 포함 X 또는 합쳐서 description에 포함
  const [rules, setRules] = useState("");

  // 명세: memberLimit
  const [memberLimit, setMemberLimit] = useState<number>(6);

  // 명세: isPublic
  const [visibility, setVisibility] = useState<Visibility>("public");

  // 명세: password (비공개일 때 숫자 6자리)
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const nameCount = studyName.length;
  const descCount = description.length;
  const rulesCount = rules.length;

  const isPrivate = visibility === "private";
  const isPublic = visibility === "public";

  const passwordValid = useMemo(() => {
    if (!isPrivate) return true; // 공개면 password 안 봄
    // 숫자 6자리
    return /^\d{6}$/.test(password.trim());
  }, [isPrivate, password]);

  const isValid = useMemo(() => {
    if (studyName.trim().length === 0) return false;
    if (studyName.length > MAX_STUDY_NAME) return false;

    if (description.trim().length === 0) return false;
    if (description.length > MAX_DESC) return false;

    if (rules.length > MAX_RULES) return false;

    if (!Number.isFinite(memberLimit) || memberLimit < 2 || memberLimit > 50) return false;

    if (!passwordValid) return false;

    return true;
  }, [studyName, description, rules, memberLimit, passwordValid]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 명세 기반 payload (현재는 API 연동 전 → console로 확인)
      const payload = {
        studyName: studyName.trim(),
        category, // enum value
        description: description.trim(),
        memberLimit,
        isPublic: isPublic, // boolean
        password: isPrivate ? password.trim() : null,
        // 명세: coverImage (null이면 default 처리) → 지금은 URL 임시
        coverImage: coverImageUrl.trim() || null,

        // rules는 명세에 없을 수 있어 우선 별도 필드로 남겨만 둠(나중에 BE와 맞추기)
        // rules: rules.trim(),
      };

      // await createStudy(payload);  // (나중에: form-data로 전환)

      alert("스터디 생성 요청(임시): 콘솔 payload 확인!");
      console.log("[createStudy payload - spec style]", payload);

      navigate("/studies");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "스터디 생성에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="studyCreatePage">
      <header className="pageHeader">
        <h1 className="pageTitle">스터디 만들기</h1>
        <p className="pageSub">간단한 정보만 입력하면 바로 만들 수 있어요.</p>
      </header>

      <form className="form" onSubmit={onSubmit}>
        {/* 커버 이미지 */}
        <section className="section">
          <div className="sectionTitleRow">
            <div className="sectionTitle">커버 이미지</div>
            <div className="counter">{coverImageUrl.length}/200</div>
          </div>

          <div className="coverRow">
            <div className="coverPreview">
              {coverImageUrl ? (
                <img src={coverImageUrl} alt="preview" />
              ) : (
                <div className="coverPlaceholder">이미지 URL을 넣으면 미리보기가 보여요</div>
              )}
            </div>

            <div className="coverInputCol">
              <label className="label">이미지 URL (임시)</label>
              <input
                className="input"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
                maxLength={200}
              />
              <div className="hint">※ 추후교체</div>
            </div>
          </div>
        </section>

        {/* 스터디명 + 카테고리 */}
        <section className="section">
          <div className="twoCol">
            <div>
              <div className="sectionTitleRow">
                <div className="sectionTitle">스터디명</div>
                <div className={`counter ${nameCount > MAX_STUDY_NAME ? "danger" : ""}`}>
                  {nameCount}/{MAX_STUDY_NAME}
                </div>
              </div>
              <input
                className={`input ${nameCount > MAX_STUDY_NAME ? "inputDanger" : ""}`}
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                placeholder="예) 2026 공무원 한국사 스터디"
                maxLength={MAX_STUDY_NAME + 10}
              />
            </div>

            <div>
              <div className="sectionTitleRow">
                <div className="sectionTitle">카테고리</div>
              </div>
              <select
                className="input select"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryValue)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 소개 */}
        <section className="section">
          <div className="sectionTitleRow">
            <div className="sectionTitle">소개</div>
            <div className={`counter ${descCount > MAX_DESC ? "danger" : ""}`}>
              {descCount}/{MAX_DESC}
            </div>
          </div>
          <textarea
            className={`textarea ${descCount > MAX_DESC ? "inputDanger" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="스터디 목적, 운영 방식 등을 간단히 써주세요."
            rows={4}
          />
        </section>

        {/* 안내/규칙(명세 확정 전이라 UI만 유지) */}
        <section className="section">
          <div className="sectionTitleRow">
            <div className="sectionTitle">안내 / 규칙</div>
            <div className={`counter ${rulesCount > MAX_RULES ? "danger" : ""}`}>
              {rulesCount}/{MAX_RULES}
            </div>
          </div>
          <textarea
            className={`textarea ${rulesCount > MAX_RULES ? "inputDanger" : ""}`}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="예) 주 3회 인증 / 무단 불참 2회 시 퇴장"
            rows={4}
          />
          <div className="hint">※ 추후 수정</div>
        </section>

        {/* 인원 + 공개여부 */}
        <section className="section">
          <div className="twoCol">
            <div>
              <div className="sectionTitleRow">
                <div className="sectionTitle">인원 제한</div>
              </div>

              <div className="capacityRow">
                <button type="button" className="stepBtn" onClick={() => setMemberLimit((v) => Math.max(2, v - 1))}>
                  −
                </button>

                <input
                  className="input capacityInput"
                  type="number"
                  value={memberLimit}
                  min={2}
                  max={50}
                  onChange={(e) => setMemberLimit(Number(e.target.value))}
                />

                <button type="button" className="stepBtn" onClick={() => setMemberLimit((v) => Math.min(50, v + 1))}>
                  +
                </button>

                <span className="hintInline">2~50명</span>
              </div>
            </div>

            <div>
              <div className="sectionTitleRow">
                <div className="sectionTitle">공개 여부</div>
              </div>

              <div className="pillRow">
                <button
                  type="button"
                  className={`pill ${isPublic ? "active" : ""}`}
                  onClick={() => setVisibility("public")}
                >
                  공개
                </button>
                <button
                  type="button"
                  className={`pill ${isPrivate ? "active" : ""}`}
                  onClick={() => setVisibility("private")}
                >
                  비공개
                </button>
              </div>

              {isPrivate && (
                <div className="mt12">
                  <label className="label">비밀번호 (숫자 6자리)</label>
                  <input
                    className={`input ${password.length > 0 && !passwordValid ? "inputDanger" : ""}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="예) 123456"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                  />
                  <div className="hint">※ 비공개 스터디는 숫자 6자리 비밀번호가 필요해요.</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 에러 */}
        {errorMsg && <div className="errorBox">{errorMsg}</div>}

        {/* 버튼 */}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={() => navigate("/studies")} disabled={submitting}>
            취소
          </button>
          <button type="submit" className="btn primary" disabled={!isValid || submitting}>
            {submitting ? "만드는 중…" : "스터디 만들기"}
          </button>
        </div>
      </form>
    </div>
  );
}