import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const technologies = [
  {
    name: 'FDM/FFF',
    title: 'Fused Deposition Modeling',
    description: 'Наиболее популярная технология для создания функциональных прототипов',
    materials: ['PLA', 'ABS', 'PETG', 'TPU'],
    precision: '±0.1mm',
    speed: 'Высокая',
    cost: 'Низкая',
    icon: '🖨️',
    usage: 85
  },
  {
    name: 'SLA',
    title: 'Stereolithography',
    description: 'Высокая точность для детализированных моделей и прототипов',
    materials: ['Фотополимер', 'Castable', 'Flexible'],
    precision: '±0.025mm',
    speed: 'Средняя',
    cost: 'Средняя',
    icon: '💎',
    usage: 60
  },
  {
    name: 'SLS',
    title: 'Selective Laser Sintering',
    description: 'Промышленная печать для функциональных деталей',
    materials: ['Нейлон', 'Металлический порошок'],
    precision: '±0.1mm',
    speed: 'Средняя',
    cost: 'Высокая',
    icon: '⚡',
    usage: 40
  },
  {
    name: 'Multi Jet',
    title: 'Multi Jet Fusion',
    description: 'Высококачественная печать для серийного производства',
    materials: ['PA12', 'PA11', 'TPU'],
    precision: '±0.08mm',
    speed: 'Очень высокая',
    cost: 'Высокая',
    icon: '🚀',
    usage: 25
  }
];

const materials = [
  { name: 'PLA', properties: 'Биоразлагаемый, простой в использовании', temp: '60°C', color: 'bg-green-500' },
  { name: 'ABS', properties: 'Прочный, термостойкий', temp: '100°C', color: 'bg-blue-500' },
  { name: 'PETG', properties: 'Химически стойкий, прозрачный', temp: '80°C', color: 'bg-purple-500' },
  { name: 'TPU', properties: 'Гибкий, эластичный', temp: '60°C', color: 'bg-orange-500' },
  { name: 'Нейлон', properties: 'Износостойкий, функциональный', temp: '120°C', color: 'bg-gray-500' },
  { name: 'Металл', properties: 'Высокая прочность, промышленный', temp: '1200°C', color: 'bg-zinc-600' }
];

export function Technologies() {
  return (
    <section id="technologies" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-sm font-medium">
            Технологии
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Технологии 3D-печати
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы используем передовые технологии для достижения лучших результатов
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {technologies.map((tech, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{tech.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tech.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{tech.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Использование в проектах</span>
                    <span className="font-medium">{tech.usage}%</span>
                  </div>
                  <Progress value={tech.usage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Точность:</span>
                    <p className="font-medium">{tech.precision}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Скорость:</span>
                    <p className="font-medium">{tech.speed}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Стоимость:</span>
                    <p className="font-medium">{tech.cost}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Материалы:</span>
                    <p className="font-medium">{tech.materials.length}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {tech.materials.map((material, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Materials Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Материалы для печати</CardTitle>
            <p className="text-muted-foreground">
              Широкий выбор материалов для различных задач
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${material.color}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{material.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{material.properties}</p>
                    <Badge variant="outline" className="text-xs">
                      {material.temp}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Standards */}
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-primary">ISO 9001</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Качество</div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="text-lg sm:text-2xl font-bold text-primary">±0.025mm</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Точность</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-primary">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Мониторинг</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}