export interface Movie {
    id: number;
    title: string;
    description?: string;
    releaseYear?: number;
    genre?: string;
    rating?: number;
    posterUrl?: string;
    videoUrl: string;
    popularityRanking: number;
    numberOfViewer: number;
}


