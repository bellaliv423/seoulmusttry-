import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-32 border-orange-200 focus:border-orange-500">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
