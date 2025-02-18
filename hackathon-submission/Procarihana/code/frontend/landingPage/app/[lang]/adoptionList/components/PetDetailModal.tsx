import { Button, Modal, Carousel } from "antd";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
} from "react";
import Image from "next/image";
import { Dog, Cat, Share2 } from "lucide-react";
import type { PetCardProps } from "./PetCard";
import PetInfoBlock from "./PetInfoBlock";
import { AppStoreContext } from "@/components/AppStoreProvider";

const PetDetailModal = (
  {
    animalInfo,
    onAdopt,
    hasButton = true
  }: {
    animalInfo: PetCardProps | null;
    onAdopt?: () => void;
    hasButton?: boolean;
  },
  ref: Ref<{
    setOpen: Function;
  }>
) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    setOpen,
  }));
  const imgArray =
    (animalInfo && animalInfo.imgs && animalInfo.imgs.split(",")) || [];
  const storeData = useContext(AppStoreContext);
  // console.log("user in child = ", storeData);

  return (
    <Modal
      title={<p>宠物详情</p>}
      loading={loading}
      open={open}
      footer={null}
      maskClosable={false}
      onCancel={() => setOpen(false)}
    >
      <div
        style={{ height: "75vh" }}
        className="overflow-y-scroll relative pb-16"
      >
        <Carousel arrows infinite={true} autoplay draggable={true}>
          {imgArray.map((img, i) => {
            return (
              <div className="h-96 bg-gray-200" key={i}>
                {/* <Image src={img} alt={""} fill/> */}
                <a href={img} target="_blank" rel="noreferrer">
                  <img src={img} alt={""} className="object-fill" />
                </a>
              </div>
            );
          })}
        </Carousel>
        <div className="flex items-center justify-start mt-4">
          <h3 className="text-lg text-gray-900 mb-0 mr-2">
            {animalInfo && animalInfo.petName}
          </h3>
          {animalInfo && animalInfo.petType === "dog" && (
            <Dog className="mr-2 h-8" />
          )}
          {animalInfo && animalInfo.petType === "cat" && (
            <Cat className="mr-2 h-8" />
          )}
          {animalInfo && animalInfo.sex === 1 && (
            <Image src="/icons/male.svg" width={20} height={20} alt="公" />
          )}
          {animalInfo && animalInfo.sex === 2 && (
            <Image src="/icons/female.svg" width={20} height={20} alt="母" />
          )}
          {/* {animalInfo.adoptNeedAddress && (
            <span className="text-xs px-2 py-1 bg-orange-100 text-[hsl(24.6,95%,53.1%)] rounded-full">{animalInfo.adoptNeedAddress}</span>
          )} */}
        </div>
        <div className="mt-3 flex justify-center">
          <div className="grid grid-cols-4 place-items-center gap-3 w-4/5">
            <PetInfoBlock type="age" animalInfo={animalInfo}></PetInfoBlock>
            <PetInfoBlock type="weight" animalInfo={animalInfo}></PetInfoBlock>
            <PetInfoBlock
              type="hairType"
              animalInfo={animalInfo}
            ></PetInfoBlock>
            <PetInfoBlock
              type="hairLength"
              animalInfo={animalInfo}
            ></PetInfoBlock>
            <PetInfoBlock type="ageType" animalInfo={animalInfo}></PetInfoBlock>
            <PetInfoBlock
              type="isDeworm"
              animalInfo={animalInfo}
            ></PetInfoBlock>
            <PetInfoBlock
              type="isNeuter"
              animalInfo={animalInfo}
            ></PetInfoBlock>
            <PetInfoBlock
              type="isVaccine"
              animalInfo={animalInfo}
            ></PetInfoBlock>
          </div>
        </div>
        <div className="mt-5">
          <p className="font-bold text-lg mb-3">详细信息</p>
          <div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">宠物状态</div>
              <div>{animalInfo && animalInfo.adoptStatus}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">发布时间</div>
              <div>{animalInfo && new Date(animalInfo.infoUpdateTime).toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">性格</div>
              <div>{animalInfo && animalInfo.characterDescription}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">是否接受合租</div>
              <div>{animalInfo && animalInfo.isShared === 0 ? '不接受' : '接受'}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">宠物所在地址</div>
              <div>{animalInfo && animalInfo.address}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">领养地址要求</div>
              <div>
                {animalInfo &&
                  animalInfo.adoptNeedAddress
                    .split(",")
                    .filter((item) => item !== "无")
                    .join("·")}
              </div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">TA的简介</div>
              <div>{animalInfo && animalInfo.petDescription}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">领养条件</div>
              <div>{animalInfo && animalInfo.adoptConditions}</div>
            </div>
            <div className="grid grid-cols-[25%_1fr] text-base mb-3">
              <div className="text-gray-600">救助故事</div>
              <div>{animalInfo && animalInfo.sourceRemark}</div>
            </div>
          </div>
        </div>
      </div>

      { hasButton && (<div className="absolute bottom-0 left-0 w-full">
        <AdoptButtonGroup onAdopt={onAdopt}></AdoptButtonGroup>
      </div>)}
    </Modal>
  );
};

const AdoptButtonGroup = ({
  onAdopt,
}: {
  onAdopt?: () => void;
}) => {
  return (
    <div className="flex justify-between items-center w-full pt-1 pb-1 px-6 border-t-1 border-neutral-200 bg-white">
      <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer">
        <Share2 />
        <span className="text-black">分享</span>
      </div>
      <Button type="primary" size="large" shape="round" onClick={onAdopt}>
        申请领养资质
      </Button>
    </div>
  );
};

export default forwardRef(PetDetailModal);
