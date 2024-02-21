export default function Modal({ dataList }: { dataList: any }) {
  const data = dataList.documents;
  return (
    <div className="modal">
      {data.map((item: any, index: number) => {
        console.log(item);
        const replaceWord = /[<b\>{\}\[\]\/\\\=\(\'\"/&#39;]/g;
        const contents = item.contents.replace(replaceWord, "");

        return (
          <a href={item.url} target="_blank" key={index}>
            {contents}
          </a>
        );
      })}
    </div>
  );
}
