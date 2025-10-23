"use client";

import React from "react";
import Informations, { FieldConfig } from "@/components/common/profile";

type Profile = {
  avatar: string;
  name: string;
  class: string;
  faculty: string;
  course: string;
  gender: string;
  dob: string;
  username: string;
  email: string;
  phone: string;
};

const initialData: Profile = {
  avatar: "/icons/student.png",
  name: "Ngô Quang Trường",
  course: "47",
  class: "J",
  faculty: "Công nghệ thông tin",
  gender: "Nam",
  dob: "2005-04-14",
  username: "23t1020573",
  email: "ngoquangtruong.isme@gmail.com",
  phone: "0339xxxxxx",
};

const fields: FieldConfig<Profile>[] = [
  { key: "name", label: "Họ và tên", type: "text", colSpan: "half",  editable: false },
  {
    key: "gender",
    label: "Giới tính",
    type: "select",
    options: ["Nam", "Nữ"],
    colSpan: "half",
  },
  { key: "dob", label: "Ngày sinh", type: "date", colSpan: "half" },
  { key: "username", label: "Tên tài khoản", type: "readonly", editable: false, colSpan: "half" },
  { key: "email", label: "Email", type: "email", colSpan: "half" },
  { key: "phone", label: "Số điện thoại", type: "tel", colSpan: "half" },
];

export default function Page() {
  const leftSummary = (
    <div className="text-sm text-gray-600 w-full">
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Khoa:</span>
          <span>{initialData.faculty}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Khoá:</span>
          <span>{initialData.course}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Lớp:</span>
          <span>{initialData.class}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Informations<Profile>
      title="Informations"
      data={initialData}
      fields={fields}
      avatarUrlKey="avatar"
      leftSummary={leftSummary}
      onAvatarChange={(file, preview) => {
        // TODO: upload avatar -> set URL; hiện mình đã preview ngay trong UI
        // console.log("avatar file", file, preview);
      }}
      onSubmit={async (next) => {
        // TODO: call API update profile
        // await fetch("/api/teacher/profile", { method: "PUT", body: JSON.stringify(next) })
      }}
      onCancel={() => {
        // Optional: toast/notify "Huỷ thay đổi"
      }}
      // Ví dụ: luôn readonly username
      readOnlyKeys={["username"]}
      className=""
    />
  );
}
