export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <p
          className="font-title text-lg text-white mb-4"
          style={{
            textShadow: [
              "-1px -1px 0px #555555",
              "1px -1px 0px #555555",
              "-1px 1px 0px #555555",
              "1px 1px 0px #555555",
              "2px 2px 0px #333333",
            ].join(", "),
          }}
        >
          CampusCraft
        </p>
        <p className="text-mc-dark-gray text-xs font-pixel mb-6">
          대학생 전용 마인크래프트 서버
        </p>
        <div className="text-mc-dark-gray text-[10px] font-pixel space-y-1">
          <p>CampusCraft는 Mojang Studios 또는 Microsoft와 관련이 없습니다.</p>
          <p>Minecraft는 Mojang Studios의 상표입니다.</p>
        </div>
      </div>
    </footer>
  );
}
