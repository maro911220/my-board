// main
export interface Reactchildren {
  children: React.ReactNode;
}

// _component/item
export interface itemProps {
  id: number;
  index: number;
  children: React.ReactNode;
}

export interface DragItemProps {
  index: number;
  id: string;
}

// _component/list
export interface mainMediaProps {
  title: string;
  id: number;
  poster_path: string;
}

// _component/(home)/poke
export interface pokeProps {
  title: string;
  id: number;
  height: number;
  weight: number;
  pokeImg: string;
  pokename: string;
  pokeGenus: string;
  pokeFlavor: string;
}

export interface pokeStatProps {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

// _component/(home)/weather
export interface dayDatasProps {
  dayWeather: string;
  temp_min: number;
  temp_max: number;
  temp: number;
  rain: number;
}

export interface timeDatasProps {
  dayWeather: string;
  temp: number;
  day: string;
}

// (page)/medialist
export interface geners {
  id: number;
  name: string;
}

export interface credits {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string;
}

export interface subMediaList {
  type: string;
  title: string;
  tagline: string;
  overview: string | null;
  poster: string;
  genres: geners[];
  runtime: number;
  release_date: string;
  credits: credits[];
  vote: number;
}
// (page)/search
export interface searchTabProps {
  type: string;
  name: string;
}

export interface SearcMainProps {
  title: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}

export interface SearcMainListProps {
  collection: string;
  datetime: string;
  display_sitename: string;
  doc_url: string;
  height: number;
  image_url: string;
  thumbnail_url: string;
  width: number;
}

export interface SearcMainImgProps {
  cafename?: string;
  blogname?: string;
  contents: string;
  datetime: string;
  thumbnail: string;
  thumbnail_url: string;
  doc_url: string;
  title: string;
  url: string;
}

export interface SearchItemProps {
  title: string;
  type: string;
}
