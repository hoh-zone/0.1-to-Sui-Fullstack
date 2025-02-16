import { ALL_FEATURES } from "@/config/feature";
import React from "react";
import { RoughNotation } from "react-rough-notation";
import { AuditOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Feature = ({
  id,
  locale,
  lang,
}: {
  id: string;
  locale: any;
  lang: string;
}) => {
  return (
    <section
      id={id}
      className="flex flex-col justify-center lg:max-w-7xl md:max-w-5xl w-[95%] mx-auto md:gap-14 pt-16"
    >
      <h2 className="text-center text-white">
        <RoughNotation type="highlight" show={true} color="#F97316">
          {locale.title}
        </RoughNotation>
      </h2>
      <Link
        href={`/${lang === "en" ? "" : lang}/adoptionList`}
        rel="noopener noreferrer nofollow"
        className="flex justify-center"
      >
        <Button
          variant="default"
          className="flex items-center gap-2 text-white"
          aria-label="Get Boilerplate"
        >
          前往领养中心
        </Button>
      </Link>
      <Steps
        items={[
          {
            title: '填写申请',
            status: 'finish',
            icon: <UserOutlined />,
            description: '选择要领养的动物，填写申请信息'
          },
          {
            title: '平台审核',
            status: 'finish',
            icon: <SolutionOutlined />,
            description: '平台审核申请，通过后签署合同并支付押金'
          },
          {
            title: '定期回访',
            status: 'finish',
            icon: <AuditOutlined />,
            description: '平台定期回访，查看领养情况。根据回访结果决定是否回收动物'
          },
          {
            title: '完成领养',
            status: 'finish',
            icon: <SmileOutlined />,
            description: '根据回访结果，决定是否可以完成领养，并退回押金'
          },
        ]}
      />
    </section>
  );
};

export default Feature;
