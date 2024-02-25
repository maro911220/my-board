import { useEffect } from "react";
import "./modal.scss";
import { useInView } from "react-intersection-observer";

export default function Modal({
  dataList,
  modalClose,
  search,
  searchData,
}: {
  dataList: any;
  searchData: string;
  modalClose: () => void;
  search: () => void;
}) {
  // Intersection Observer
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Intersection Observer의 상태 변화 체크
  useEffect(() => {
    if (inView) search();
  }, [inView]);

  return (
    <div className="modal">
      <div className="modal-con" onClick={(e) => e.stopPropagation()}>
        <p className="modal-result">
          <span>{searchData}</span> 검색 결과
        </p>
        <div className="modal-list">
          {dataList.length > 0 ? (
            // 검색 결과가 있을 경우 각 항목을 매핑하여 렌더링합니다.
            dataList.map((item: any, index: number) => {
              // 정규식을 이용하여 컨텐츠와 제목에서 HTML 태그 제거.
              const replaceWord = /[<b\>{\}\[\]\/\\\=\(\'\"/&#39;]/g;
              const contents = item.contents.replace(replaceWord, "");
              const title = item.title.replace(replaceWord, "");
              const datetime = item.datetime.slice(0, 10);

              return (
                <a
                  ref={ref}
                  className="modal-list-item"
                  href={item.url}
                  target="_blank"
                  key={index}
                >
                  <div>
                    <span>{title}</span>
                    <span>| {datetime}</span>
                  </div>
                  <span>{contents}</span>
                </a>
              );
            })
          ) : (
            // 검색 결과가 없을 경우 메시지를 표시합니다.
            <div>검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
      <div className="modal-wrapper" onClick={modalClose}></div>
    </div>
  );
}
