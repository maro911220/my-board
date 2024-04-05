import Image from "next/image";
import { SearcMainImgProps } from "@/types/itemsType";
export default function ListItem({ item }: { item: SearcMainImgProps }) {
  console.log(item);
  return (
    item.thumbnail_url && (
      <a href={item.doc_url} target="_blank">
        <div>
          <Image
            src={item.thumbnail_url}
            alt={item.thumbnail_url}
            width={150}
            height={150}
          />
        </div>
      </a>
    )
  );
}
