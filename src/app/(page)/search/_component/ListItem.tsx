import Image from "next/image";

export default function ListItem({ item }: { item: any }) {
  const replaceWord = /[<b\>{\}\[\]\/\\\=\(\'\"/&#39;]/g;
  const contents = item.contents?.replace(replaceWord, "");
  const title = item.title?.replace(replaceWord, "");
  const datetime = item.datetime?.slice(0, 10);
  const thumbnail = item.thumbnail ? item.thumbnail : null;
  const blogname = item.blogname ? item.blogname : null;
  const cafename = item.cafename ? item.cafename : null;
  const shortUrl = item.url?.split("//")[1]?.split("/")[0];

  return (
    <a className="search-list-item" href={item.url} target="_blank">
      <div className="search-list-item__top">
        <span className="search-list-item__date">{datetime}</span>
        {blogname ? (
          <span>{`${shortUrl} / ${blogname}`}</span>
        ) : cafename ? (
          <span>{`${shortUrl} / ${cafename}`}</span>
        ) : (
          <span>{shortUrl}</span>
        )}
        <p>{title}</p>
      </div>
      <div className="search-list-item__content">
        {thumbnail && (
          <Image src={thumbnail} alt={title} width={128} height={128} />
        )}
        <p>{contents}</p>
      </div>
    </a>
  );
}
