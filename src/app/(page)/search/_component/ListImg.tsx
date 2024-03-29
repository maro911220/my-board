import Image from "next/image";

export default function ListItem({ item }: { item: any }) {
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
