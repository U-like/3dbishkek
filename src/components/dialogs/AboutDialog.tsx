import { Users, Target, Award, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const team = [
  {
    name: '***',
    role: 'Основатель и CEO',
    experience: '10 лет в 3D-печати',
    emoji: '👨‍💼'
  },
  {
    name: '***',
    role: 'Технический директор',
    experience: '6 лет в инженерии',
    emoji: '👩‍🔬'
  },
  {
    name: '***',
    role: 'Дизайнер',
    experience: '5 лет в 3D-моделировании',
    emoji: '👨‍🎨'
  }
];

const achievements = [
  { label: 'Проектов выполнено', value: 500, max: 500 },
  { label: 'Довольных клиентов', value: 150, max: 200 },
  { label: 'Технологий освоено', value: 8, max: 10 },
  { label: 'Лет на рынке', value: 3, max: 5 }
];

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">О компании 3DBishkek</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Description */}
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🖨️</div>
            <h3 className="text-xl font-semibold">Лидеры 3D-печати в Кыргызстане</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы — команда профессионалов, которая воплощает самые смелые идеи в реальность 
              с помощью передовых технологий 3D-печати. Наша миссия — сделать инновационные 
              технологии доступными для каждого.
            </p>
          </div>

          {/* Mission & Values */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Наша миссия</h4>
                <p className="text-sm text-muted-foreground">
                  Делать 3D-печать доступной и качественной для всех слоев населения
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Качество</h4>
                <p className="text-sm text-muted-foreground">
                  Используем только проверенные материалы и современное оборудование
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Инновации</h4>
                <p className="text-sm text-muted-foreground">
                  Постоянно внедряем новые технологии и совершенствуем процессы
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Наша команда</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {team.map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="text-3xl">{member.emoji}</div>
                    <h4 className="font-semibold text-sm">{member.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{member.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Наши достижения</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{achievement.label}</span>
                    <span className="font-medium">{achievement.value}+</span>
                  </div>
                  <Progress value={(achievement.value / achievement.max) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Наши услуги</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Badge variant="outline" className="justify-center py-2">
                3D-печать изделий
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                3D-моделирование
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Консультации
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Обучение
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Ремонт принтеров
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Продажа материалов
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Индивидуальные проекты
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Техподдержка
              </Badge>
            </div>
          </div>

          {/* Company Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">2021</div>
                  <div className="text-sm text-muted-foreground">Год основания</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Сотрудников</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Поддержка</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Довольных клиентов</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}