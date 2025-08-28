import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const videos = [
  {
    id: 1,
    title: 'Процесс 3D-печати',
    description: 'Как происходит создание изделия от модели до готового продукта',
    duration: '3:45',
    thumbnail: '🎬',
    category: 'Процесс'
  },
  {
    id: 2,
    title: 'Обзор технологий',
    description: 'Сравнение различных технологий 3D-печати',
    duration: '5:20',
    thumbnail: '🔬',
    category: 'Технологии'
  },
  {
    id: 3,
    title: 'Материалы и их свойства',
    description: 'Подробный обзор материалов для 3D-печати',
    duration: '4:12',
    thumbnail: '🧪',
    category: 'Материалы'
  }
];

export function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="video" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-sm font-medium">
            Видео
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Как мы работаем
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Посмотрите на процесс создания уникальных изделий с помощью 3D-печати
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group">
                  {/* Video Placeholder */}
                  <div className="text-6xl mb-4">
                    {videos[selectedVideo].thumbnail}
                  </div>
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                    
                    <div className="flex-1 h-1 bg-white/30 rounded-full">
                      <div className="h-full w-1/3 bg-white rounded-full" />
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Maximize className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">
                      {videos[selectedVideo].duration}
                    </Badge>
                  </div>
                </div>
                
                {/* Video Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {videos[selectedVideo].category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {videos[selectedVideo].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {videos[selectedVideo].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Playlist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Другие видео</h3>
            {videos.map((video, index) => (
              <Card
                key={video.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  index === selectedVideo ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVideo(index)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-2xl shrink-0">
                      {video.thumbnail}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {video.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Stats */}
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-primary">50+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Видео уроков</div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="text-lg sm:text-2xl font-bold text-primary">10k+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Просмотров</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-primary">4.9</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Рейтинг</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}