export interface University {
  id: string;
  name: string;
  tag: string;
  colorHex: string;
}

export const universities: University[] = [
  // 서울 주요 대학
  { id: "snu", name: "서울대학교", tag: "SNU", colorHex: "#003876" },
  { id: "korea", name: "고려대학교", tag: "KOREA", colorHex: "#86001C" },
  { id: "yonsei", name: "연세대학교", tag: "YONSEI", colorHex: "#00205B" },
  { id: "skku", name: "성균관대학교", tag: "SKKU", colorHex: "#006241" },
  { id: "hanyang", name: "한양대학교", tag: "HANYANG", colorHex: "#0E4A84" },
  { id: "sogang", name: "서강대학교", tag: "SOGANG", colorHex: "#A50034" },
  { id: "ewha", name: "이화여자대학교", tag: "EWHA", colorHex: "#005F4E" },
  { id: "cau", name: "중앙대학교", tag: "CAU", colorHex: "#1E4D8E" },
  { id: "khu", name: "경희대학교", tag: "KHU", colorHex: "#B50938" },
  { id: "hufs", name: "한국외국어대학교", tag: "HUFS", colorHex: "#003399" },
  { id: "uos", name: "서울시립대학교", tag: "UOS", colorHex: "#2C5F2D" },
  { id: "ssu", name: "숭실대학교", tag: "SSU", colorHex: "#1E3D6B" },
  { id: "hongik", name: "홍익대학교", tag: "HONGIK", colorHex: "#E31C3D" },
  { id: "konkuk", name: "건국대학교", tag: "KONKUK", colorHex: "#006747" },
  { id: "dongguk", name: "동국대학교", tag: "DONGGUK", colorHex: "#F37321" },
  { id: "sejong", name: "세종대학교", tag: "SEJONG", colorHex: "#8B0000" },

  // 과학기술특성화대학
  { id: "kaist", name: "KAIST", tag: "KAIST", colorHex: "#004A9C" },
  { id: "postech", name: "POSTECH", tag: "POSTECH", colorHex: "#CC0000" },
  { id: "gist", name: "GIST", tag: "GIST", colorHex: "#1B5E20" },
  { id: "unist", name: "UNIST", tag: "UNIST", colorHex: "#0288D1" },
  { id: "dgist", name: "DGIST", tag: "DGIST", colorHex: "#0066CC" },

  // 지방 거점 국립대
  { id: "pusan", name: "부산대학교", tag: "PNU", colorHex: "#1565C0" },
  { id: "knu", name: "경북대학교", tag: "KNU", colorHex: "#6A1B9A" },
  { id: "jnu", name: "전남대학교", tag: "JNU", colorHex: "#006400" },
  { id: "cnu", name: "충남대학교", tag: "CNU", colorHex: "#00838F" },
  { id: "cbnu", name: "충북대학교", tag: "CBNU", colorHex: "#558B2F" },
  { id: "gnu", name: "경상국립대학교", tag: "GNU", colorHex: "#4E342E" },
  { id: "jbnu", name: "전북대학교", tag: "JBNU", colorHex: "#AD1457" },
  { id: "kangwon", name: "강원대학교", tag: "KANGWON", colorHex: "#00695C" },
  { id: "jejunu", name: "제주대학교", tag: "JEJUNU", colorHex: "#E65100" },
];
