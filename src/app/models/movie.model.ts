export interface Movie {
    id: number;
    title: string;
    description?: string;
    releaseYear?: number;
    genre?: string;
    avgRating?: number;
    posterUrl?: string;
    videoUrl: string;
    popularityRanking: number;
    numberOfViewer: number;
    length:number;
}


