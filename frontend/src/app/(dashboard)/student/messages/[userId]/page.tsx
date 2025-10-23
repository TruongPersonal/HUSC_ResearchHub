import DMThread from "@/components/messages/data_messages_thread";

type Role = "STUDENT" | "TEACHER";

export function inferRoleFromId(id: string, bias?: "student" | "teacher"): Role {
  const s = id.trim().toLowerCase();

  // SV: bắt đầu bằng 2 số + 't' + số
  const looksStudent =
    /^\d{2}t\d+$/i.test(s)           // khớp chặt theo bạn mô tả
    || (/^\d/.test(s) && /[0-9]/.test(s)); // bắt đầu bằng số và có số (nới lỏng)

  // GV: chỉ chữ cái (không số)
  const looksTeacher = /^[a-z]+$/i.test(s);

  if (looksStudent && !looksTeacher) return "STUDENT";
  if (looksTeacher && !looksStudent) return "TEACHER";

  // Trường hợp mơ hồ → ưu tiên bias theo không gian
  if (bias === "student") return "TEACHER"; // SV đang ở inbox -> hay nhắn GV
  if (bias === "teacher") return "STUDENT";
  return "TEACHER"; // mặc định an toàn
}

const nameById = (id: string) => `#${id}`; // mock: sau này gọi API lấy tên thật

export default function Page({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams?: { role?: "STUDENT" | "TEACHER" };
}) {
  const userId = params.userId;

  // Nếu có query ?role=STUDENT|TEACHER thì ưu tiên; không thì suy luận theo userId
  const otherRole: Role =
    (searchParams?.role as Role | undefined) ?? inferRoleFromId(userId);

  return (
    <DMThread
      me={{ id: "23t1020573", name: "Ngô Quang Trường", role: "STUDENT" }}
      other={{ id: userId, name: nameById(userId), role: otherRole }}
      backHref="/student/messages"
    />
  );
}