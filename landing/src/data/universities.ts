export interface University {
  id: string;
  name: string;
  tag: string;
  colorHex: string;
  emailDomains: string[];
}

export const universities: University[] = [
  // 서울 주요 대학
  { id: "snu", name: "서울대학교", tag: "SNU", colorHex: "#003876", emailDomains: ["snu.ac.kr"] },
  { id: "korea", name: "고려대학교", tag: "KOREA", colorHex: "#86001C", emailDomains: ["korea.ac.kr"] },
  { id: "yonsei", name: "연세대학교", tag: "YONSEI", colorHex: "#00205B", emailDomains: ["yonsei.ac.kr"] },
  { id: "skku", name: "성균관대학교", tag: "SKKU", colorHex: "#006241", emailDomains: ["skku.edu", "g.skku.edu"] },
  { id: "hanyang", name: "한양대학교", tag: "HANYANG", colorHex: "#0E4A84", emailDomains: ["hanyang.ac.kr"] },
  { id: "sogang", name: "서강대학교", tag: "SOGANG", colorHex: "#A50034", emailDomains: ["sogang.ac.kr"] },
  { id: "ewha", name: "이화여자대학교", tag: "EWHA", colorHex: "#005F4E", emailDomains: ["ewha.ac.kr", "ewhain.net"] },
  { id: "cau", name: "중앙대학교", tag: "CAU", colorHex: "#1E4D8E", emailDomains: ["cau.ac.kr"] },
  { id: "khu", name: "경희대학교", tag: "KHU", colorHex: "#B50938", emailDomains: ["khu.ac.kr"] },
  { id: "hufs", name: "한국외국어대학교", tag: "HUFS", colorHex: "#003399", emailDomains: ["hufs.ac.kr"] },
  { id: "uos", name: "서울시립대학교", tag: "UOS", colorHex: "#2C5F2D", emailDomains: ["uos.ac.kr"] },
  { id: "ssu", name: "숭실대학교", tag: "SSU", colorHex: "#1E3D6B", emailDomains: ["ssu.ac.kr"] },
  { id: "hongik", name: "홍익대학교", tag: "HONGIK", colorHex: "#E31C3D", emailDomains: ["hongik.ac.kr", "g.hongik.ac.kr"] },
  { id: "konkuk", name: "건국대학교", tag: "KONKUK", colorHex: "#006747", emailDomains: ["konkuk.ac.kr"] },
  { id: "dongguk", name: "동국대학교", tag: "DONGGUK", colorHex: "#F37321", emailDomains: ["dongguk.edu", "dgu.ac.kr"] },
  { id: "sejong", name: "세종대학교", tag: "SEJONG", colorHex: "#8B0000", emailDomains: ["sju.ac.kr"] },

  // 과학기술특성화대학
  { id: "kaist", name: "KAIST", tag: "KAIST", colorHex: "#004A9C", emailDomains: ["kaist.ac.kr"] },
  { id: "postech", name: "POSTECH", tag: "POSTECH", colorHex: "#CC0000", emailDomains: ["postech.ac.kr"] },
  { id: "gist", name: "GIST", tag: "GIST", colorHex: "#1B5E20", emailDomains: ["gist.ac.kr", "gm.gist.ac.kr"] },
  { id: "unist", name: "UNIST", tag: "UNIST", colorHex: "#0288D1", emailDomains: ["unist.ac.kr"] },
  { id: "dgist", name: "DGIST", tag: "DGIST", colorHex: "#0066CC", emailDomains: ["dgist.ac.kr"] },

  // 지방 거점 국립대
  { id: "pusan", name: "부산대학교", tag: "PNU", colorHex: "#1565C0", emailDomains: ["pusan.ac.kr"] },
  { id: "knu", name: "경북대학교", tag: "KNU", colorHex: "#6A1B9A", emailDomains: ["knu.ac.kr"] },
  { id: "jnu", name: "전남대학교", tag: "JNU", colorHex: "#006400", emailDomains: ["jnu.ac.kr"] },
  { id: "cnu", name: "충남대학교", tag: "CNU", colorHex: "#00838F", emailDomains: ["cnu.ac.kr", "o.cnu.ac.kr"] },
  { id: "cbnu", name: "충북대학교", tag: "CBNU", colorHex: "#558B2F", emailDomains: ["chungbuk.ac.kr"] },
  { id: "gnu", name: "경상국립대학교", tag: "GNU", colorHex: "#4E342E", emailDomains: ["gnu.ac.kr"] },
  { id: "jbnu", name: "전북대학교", tag: "JBNU", colorHex: "#AD1457", emailDomains: ["jbnu.ac.kr"] },
  { id: "kangwon", name: "강원대학교", tag: "KANGWON", colorHex: "#00695C", emailDomains: ["kangwon.ac.kr"] },
  { id: "jejunu", name: "제주대학교", tag: "JEJUNU", colorHex: "#E65100", emailDomains: ["jejunu.ac.kr"] },
];

// 이메일 도메인 → 대학 매핑 유틸리티
export function findUniversityByEmail(email: string): University | undefined {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return undefined;
  return universities.find((u) =>
    u.emailDomains.some((d) => domain === d || domain.endsWith(`.${d}`))
  );
}
