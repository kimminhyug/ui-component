# ui-component

Tailwind + Headless UI 기반 공용 UI 라이브러리.

## 컨셉

- **Atomic Design**: 재사용 가능한 단위만 atoms / molecules 로 분리
- **폴더**: kebab-case, **컴포넌트**: camelCase
- **생명주기**: 부모 props로 제어 (controlled). 도메인 로직은 훅으로 분리
- **다중 라이브러리 대응**: `className`, `style` 등으로 스타일 주입 가능
- **테마**: Tailwind 기반 키 기반 테마. `themes` 레지스트리 + `defaultThemeKey`로 선택, base와 merge

## 설치

```bash
npm install @headlessui/react tailwindcss clsx tailwind-merge
# peer: react, react-dom
```

## 사용

### 테마 (키 기반)

```tsx
import { ThemeProvider, useTheme, useThemeKey, useThemeActions, Button } from 'ui-component';
import { neonTheme } from 'ui-component';

const themes = {
  default: {},
  neon: neonTheme,
};

<ThemeProvider themes={themes} defaultThemeKey="neon">
  <Button variant="primary">클릭</Button>
</ThemeProvider>;
```

- **훅**: `useTheme()` 현재 테마, `useThemeKey()` 현재 키, `useThemeActions()` → `setThemeKey`, `updateTheme`
- **프리셋**: `neonTheme`, `spaceTheme`, `retroTheme` export

### 컴포넌트 단위 theme

```tsx
<Button theme={{ primary: 'bg-green-600' }} variant="primary">
  저장
</Button>
```

### 훅 (도메인 로직)

```tsx
import { useDisclosure, Modal, Button } from 'ui-component';

function MyForm() {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>열기</Button>
      <Modal open={isOpen} onClose={close} title="제목">
        내용
      </Modal>
    </>
  );
}
```

## 프로젝트 구조

```
src/
  theme/           # base-theme, merge-theme, ThemeProvider
  components/
    atoms/         # Button, Input, Badge
    molecules/     # Modal, Dropdown, Tabs, Checkbox (Headless UI 래핑)
  hooks/           # useDisclosure 등
  utils/           # cn (class 병합)
  types/           # Stylable, ThemedComponent, ControlledProps
```

소비 측에서 Tailwind content에 `node_modules/ui-component/src/**/*.{js,ts,jsx,tsx}` 를 포함해야 합니다.

## Storybook (데모·사용법)

```bash
npm run storybook
```

- **Atoms**: Button, Input, Badge — variant/size/테마 오버라이드 예시
- **Molecules**: Modal, Dropdown, Tabs, Checkbox — 제어/비제어, 훅(useDisclosure) 연동 예시
- **Theme/Override**: 키 기반 테마, Neon/Space/Retro 프리셋 및 전체 컴포넌트 데모

빌드: `npm run build-storybook` → `storybook-static` 출력

## 테스트

```bash
npm run test        # watch
npm run test:run    # 1회 실행
```

Vitest + Testing Library. `src/**/*.test.{ts,tsx}`

## npm 배포

```bash
npm run build
npm publish
```

`prepublishOnly`로 publish 시 자동 빌드. 스코프 패키지 공개: `publishConfig.access: "public"`. 저장소 URL은 `package.json`의 `repository.url`에 설정.
