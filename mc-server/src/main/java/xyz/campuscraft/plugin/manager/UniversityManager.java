package xyz.campuscraft.plugin.manager;

import xyz.campuscraft.plugin.model.UniversityInfo;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class UniversityManager {

    private final Map<String, UniversityInfo> byTag = new HashMap<>();

    public UniversityManager() {
        register("snu", "서울대학교", "SNU", "#003876");
        register("korea", "고려대학교", "KOREA", "#86001C");
        register("yonsei", "연세대학교", "YONSEI", "#00205B");
        register("skku", "성균관대학교", "SKKU", "#006241");
        register("hanyang", "한양대학교", "HANYANG", "#0E4A84");
        register("sogang", "서강대학교", "SOGANG", "#A50034");
        register("ewha", "이화여자대학교", "EWHA", "#005F4E");
        register("cau", "중앙대학교", "CAU", "#1E4D8E");
        register("khu", "경희대학교", "KHU", "#B50938");
        register("hufs", "한국외국어대학교", "HUFS", "#003399");
        register("uos", "서울시립대학교", "UOS", "#2C5F2D");
        register("ssu", "숭실대학교", "SSU", "#1E3D6B");
        register("hongik", "홍익대학교", "HONGIK", "#E31C3D");
        register("konkuk", "건국대학교", "KONKUK", "#006747");
        register("dongguk", "동국대학교", "DONGGUK", "#F37321");
        register("sejong", "세종대학교", "SEJONG", "#8B0000");
        register("kaist", "KAIST", "KAIST", "#004A9C");
        register("postech", "POSTECH", "POSTECH", "#CC0000");
        register("gist", "GIST", "GIST", "#1B5E20");
        register("unist", "UNIST", "UNIST", "#0288D1");
        register("dgist", "DGIST", "DGIST", "#0066CC");
        register("pusan", "부산대학교", "PNU", "#1565C0");
        register("knu", "경북대학교", "KNU", "#6A1B9A");
        register("jnu", "전남대학교", "JNU", "#006400");
        register("cnu", "충남대학교", "CNU", "#00838F");
        register("cbnu", "충북대학교", "CBNU", "#558B2F");
        register("gnu", "경상국립대학교", "GNU", "#4E342E");
        register("jbnu", "전북대학교", "JBNU", "#AD1457");
        register("kangwon", "강원대학교", "KANGWON", "#00695C");
        register("jejunu", "제주대학교", "JEJUNU", "#E65100");
    }

    private void register(String id, String name, String tag, String colorHex) {
        byTag.put(tag, new UniversityInfo(id, name, tag, colorHex));
    }

    public UniversityInfo getByTag(String tag) {
        return byTag.get(tag);
    }

    public Collection<UniversityInfo> getAll() {
        return byTag.values();
    }

    public int count() {
        return byTag.size();
    }
}
