import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Send, ArrowLeft } from 'lucide-react';

interface OrderPageProps {
  onViewChange: (view: 'home' | 'shop' | 'order') => void;
}

export function OrderPage({ onViewChange }: OrderPageProps) {
  const [userType, setUserType] = useState<'beginner' | 'expert' | ''>('');
  const [purpose, setPurpose] = useState('');
  const [technology, setTechnology] = useState('');
  const [material, setMaterial] = useState('');
  const [hasModel, setHasModel] = useState<'yes' | 'no' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    quantity: '1'
  });

  const purposes = [
    { value: 'prototype', label: 'Прототипирование', materials: ['PLA', 'PETG', 'ABS'] },
    { value: 'miniatures', label: 'Миниатюры и фигурки', materials: ['Resin', 'PLA'] },
    { value: 'functional', label: 'Функциональные детали', materials: ['ABS', 'ASA', 'PETG', 'Nylon'] },
    { value: 'decorative', label: 'Декоративные изделия', materials: ['PLA', 'Wood-fill', 'Metal-fill'] },
    { value: 'automotive', label: 'Автомобильные детали', materials: ['ABS', 'ASA', 'PA12'] },
    { value: 'medical', label: 'Медицинские изделия', materials: ['PETG', 'Medical grade resin'] },
    { value: 'jewelry', label: 'Ювелирные изделия', materials: ['Castable resin', 'Wax'] },
    { value: 'architectural', label: 'Архитектурные модели', materials: ['PLA', 'ABS'] }
  ];

  const technologies = [
    { 
      value: 'fdm', 
      label: 'FDM/FFF (Пластиковые нити)', 
      materials: ['PLA', 'ABS', 'PETG', 'ASA', 'TPU', 'Nylon', 'Wood-fill', 'Metal-fill', 'Carbon fiber'] 
    },
    { 
      value: 'sla', 
      label: 'SLA (Фотополимерная смола)', 
      materials: ['Standard resin', 'Tough resin', 'Flexible resin', 'Castable resin', 'Medical grade resin'] 
    },
    { 
      value: 'sls', 
      label: 'SLS (Селективное лазерное спекание)', 
      materials: ['PA12', 'PA11', 'Glass-filled PA12', 'Metal powder'] 
    }
  ];

  const getMaterialsForSelection = () => {
    if (userType === 'beginner' && purpose) {
      const selectedPurpose = purposes.find(p => p.value === purpose);
      return selectedPurpose?.materials || [];
    } else if (userType === 'expert' && technology) {
      const selectedTech = technologies.find(t => t.value === technology);
      return selectedTech?.materials || [];
    }
    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки заказа
    console.log('Order submitted:', {
      userType,
      purpose,
      technology,
      material,
      hasModel,
      ...formData
    });
    alert('Заказ отправлен! Мы свяжемся с вами в ближайшее время.');
  };

  const resetForm = () => {
    // НЕ очищаем userType, только остальные поля
    setPurpose('');
    setTechnology('');
    setMaterial('');
    setHasModel('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      description: '',
      quantity: '1'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => onViewChange('home')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Заказать 3D печать</h1>
              <p className="text-muted-foreground">Создайте заказ на профессиональную 3D печать</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Уровень знаний */}
            <Card>
              <CardHeader>
                <CardTitle>Ваш уровень знаний в 3D печати</CardTitle>
                <CardDescription>
                  Выберите подходящий вариант для более точного подбора материалов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={userType === 'beginner' ? 'default' : 'outline'}
                    className="p-6 h-auto flex flex-col items-start text-left"
                    onClick={() => {
                      setUserType('beginner');
                      resetForm();
                    }}
                  >
                    <div className="font-medium text-base mb-1">Новичок</div>
                    <div className="text-sm opacity-80">
                      Не знаком с технологиями 3D печати
                    </div>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={userType === 'expert' ? 'default' : 'outline'}
                    className="p-6 h-auto flex flex-col items-start text-left"
                    onClick={() => {
                      setUserType('expert');
                      resetForm();
                    }}
                  >
                    <div className="font-medium text-base mb-1">Эксперт</div>
                    <div className="text-sm opacity-80">
                      Знаком с технологиями и материалами
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Для новичков - выбор назначения */}
            {userType === 'beginner' && (
              <Card>
                <CardHeader>
                  <CardTitle>Для чего предназначена печать?</CardTitle>
                  <CardDescription>
                    Выберите назначение, и мы подберем подходящие материалы
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите назначение" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Для экспертов - выбор технологии */}
            {userType === 'expert' && (
              <Card>
                <CardHeader>
                  <CardTitle>Технология 3D печати</CardTitle>
                  <CardDescription>
                    Выберите предпочитаемую технологию печати
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={technology} onValueChange={setTechnology}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите технологию" />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map((tech) => (
                        <SelectItem key={tech.value} value={tech.value}>
                          {tech.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Выбор материала */}
            {((userType === 'beginner' && purpose) || (userType === 'expert' && technology)) && (
              <Card>
                <CardHeader>
                  <CardTitle>Материал для печати</CardTitle>
                  <CardDescription>
                    Выберите подходящий материал из рекомендованных
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите материал" />
                    </SelectTrigger>
                    <SelectContent>
                      {getMaterialsForSelection().map((mat) => (
                        <SelectItem key={mat} value={mat}>
                          {mat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {material && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary">Выбранный материал: {material}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Наличие модели */}
            {material && (
              <Card>
                <CardHeader>
                  <CardTitle>Наличие 3D модели</CardTitle>
                  <CardDescription>
                    У вас уже есть готовая 3D модель для печати?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={hasModel === 'yes' ? 'default' : 'outline'}
                      className="p-4 h-auto flex items-center gap-3 text-left"
                      onClick={() => setHasModel('yes')}
                    >
                      <FileText className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Да, есть модель</div>
                        <div className="text-sm opacity-80">
                          Загружу файл для печати
                        </div>
                      </div>
                    </Button>
                    
                    <Button
                      type="button"
                      variant={hasModel === 'no' ? 'default' : 'outline'}
                      className="p-4 h-auto flex items-start gap-3 text-left"
                      onClick={() => setHasModel('no')}
                    >
                      <div className="mt-1">
                        <div className="font-medium">Нет, нужна разработка</div>
                        <div className="text-sm opacity-80">
                          Требуется создание 3D модели
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Контактная информация и детали заказа */}
            {hasModel && (
              <Card>
                <CardHeader>
                  <CardTitle>Детали заказа</CardTitle>
                  <CardDescription>
                    Заполните контактную информацию и детали заказа
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Контактные данные */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ваше имя"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+996 xxx xxx xxx"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Количество экземпляров</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    />
                  </div>

                  <Separator />

                  {/* Загрузка файла или описание */}
                  {hasModel === 'yes' && (
                    <div className="space-y-2">
                      <Label>Загрузка 3D модели</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Перетащите файлы сюда или нажмите для выбора
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Поддерживаемые форматы: STL, OBJ, 3MF (макс. 50MB)
                        </p>
                        <Button type="button" variant="outline" className="mt-2">
                          Выбрать файлы
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Дополнительные требования</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Опишите особые требования к печати, размеры, цвет, постобработка и т.д."
                      rows={4}
                    />
                  </div>

                  {/* Сводка заказа */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Сводка заказа:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Уровень:</span>
                        <span>{userType === 'beginner' ? 'Новичок' : 'Эксперт'}</span>
                      </div>
                      {purpose && (
                        <div className="flex justify-between">
                          <span>Назначение:</span>
                          <span>{purposes.find(p => p.value === purpose)?.label}</span>
                        </div>
                      )}
                      {technology && (
                        <div className="flex justify-between">
                          <span>Технология:</span>
                          <span>{technologies.find(t => t.value === technology)?.label}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Материал:</span>
                        <span>{material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Количество:</span>
                        <span>{formData.quantity} шт.</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3D модель:</span>
                        <span>{hasModel === 'yes' ? 'Есть' : 'Требуется разработка'}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    <Send className="h-4 w-4" />
                    Отправить заказ
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}