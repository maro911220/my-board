/* eslint-disable @next/next/no-img-element */
import "./list.scss";

export default function MediaList({ mediaData }: { mediaData: any }) {
  return (
    <div>
      <img
        src={`https://image.tmdb.org/t/p/w500/${mediaData.poster}`}
        alt={mediaData.title}
      />
      <p>{mediaData.title}</p>
      <p>{mediaData.tagline}</p>
      <p>{mediaData.runtime}분</p>
      <div>
        {mediaData.genres.map(
          (item: { id: number; name: string }, index: number) => {
            return <p key={index}>{item.name}</p>;
          }
        )}
      </div>
      <p>{mediaData.release_date}</p>
      <p>{mediaData.overview}</p>
    </div>
  );
}
