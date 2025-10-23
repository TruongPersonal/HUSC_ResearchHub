"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Role = "STUDENT" | "TEACHER";

export default function DMThread({
  me,
  other,
  seed = 2,
  backHref,
}: {
  me: { id: string; name: string; role: Role };
  other: { id: string; name: string; role: Role };
  seed?: number;
  backHref?: string;
}) {
  type Msg = { id: number; fromUserId: string; body: string; at: string };

  const router = useRouter();
  const now = () => new Date().toLocaleString("vi-VN", { hour12: false });

  // Demo hội thoại ban đầu (không phụ thuộc role, chỉ phân biệt người gửi)
  const initial = useMemo<Msg[]>(() => {
    const demo: Array<{ from: "me" | "other"; text: string }> = [
      { from: "me", text: `Chào ${other.name}, mình là ${me.name}.` },
      { from: "other", text: `Chào ${me.name}, bạn cần mình hỗ trợ gì không?` },
    ];
    const take = Math.max(2, seed);
    return demo.slice(0, take).map((d, i) => ({
      id: i + 1,
      fromUserId: d.from === "me" ? me.id : other.id,
      body: d.text,
      at: now(),
    }));
  }, [seed, me.id, me.name, other.id, other.name]);

  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false); // khoá chống gửi đúp

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs.length]);

  const send = () => {
    if (sendingRef.current) return;
    const body = text.trim();
    if (!body) return;

    sendingRef.current = true;
    setMsgs((prev) => [
      ...prev,
      { id: prev.length + 1, fromUserId: me.id, body, at: now() },
    ]);
    setText("");

    setTimeout(() => {
      sendingRef.current = false;
    }, 200);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.repeat && !isComposing) {
      e.preventDefault();
      send();
    }
  };

  const bubble = (m: Msg) => {
    const mine = m.fromUserId === me.id;
    return (
      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"} px-2`}>
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow ${
            mine ? "bg-blue-600 text-white" : "bg-neutral-100"
          }`}
        >
          <div className="whitespace-pre-wrap">{m.body}</div>
          <div className={`mt-1 text-[10px] opacity-80 ${mine ? "text-blue-100" : "text-neutral-500"}`}>
            {m.at}
          </div>
        </div>
      </div>
    );
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref || "/");
    }
  };

  const roleLabel = (r: Role) => (r === "STUDENT" ? "Sinh viên" : "Giảng viên");

  return (
    <div className="max-w-5xl mx-auto mt-30 h-[70vh] flex flex-col gap-3 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">
            Bạn: <b>{me.name}</b> ({roleLabel(me.role)}) • Đang trò chuyện với{" "}
            <b>{other.name}</b> ({roleLabel(other.role)})
          </div>
          <h1 className="text-lg font-semibold mt-1">
            {me.name} ↔ {other.name}
          </h1>
        </div>
        <Button variant="outline" onClick={goBack}>
          Quay lại
        </Button>
      </div>

      {/* Khung chat */}
      <Card className="flex-1 overflow-hidden">
        <div ref={scrollerRef} className="h-full overflow-y-auto p-3 space-y-2 bg-white">
          {msgs.map(bubble)}
        </div>
      </Card>

      {/* Ô nhập */}
      <div className="flex gap-2">
        <Input
          placeholder="Nhập tin nhắn…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
        <Button onClick={send} disabled={!text.trim()}>
          Gửi
        </Button>
      </div>
    </div>
  );
}
