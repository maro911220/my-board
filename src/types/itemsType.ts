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

// (page)/search
export interface SearcMainhProps {
  title: string;
  setType: any;
}

export interface SearchItemProps {
  title: string;
  type: string;
}
