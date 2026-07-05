import type { IconType } from 'react-icons';
import { FaDocker, FaRaspberryPi, FaRust } from 'react-icons/fa';
import {
	SiAstro,
	SiFastapi,
	SiGo,
	SiJavascript,
	SiNextdotjs,
	SiNodedotjs,
	SiNpm,
	SiOpentelemetry,
	SiPostcss,
	SiPython,
	SiReact,
	SiRedis,
	SiSqlite,
	SiTypescript
} from 'react-icons/si';

interface StackIcon {
	icon: IconType;
	label: string;
}

export const STACK_ICONS = {
	astro: { icon: SiAstro, label: 'Astro' },
	docker: { icon: FaDocker, label: 'Docker' },
	fastapi: { icon: SiFastapi, label: 'FastAPI' },
	go: { icon: SiGo, label: 'Go' },
	javascript: { icon: SiJavascript, label: 'JavaScript' },
	nextjs: { icon: SiNextdotjs, label: 'Next.js' },
	node: { icon: SiNodedotjs, label: 'Node' },
	npm: { icon: SiNpm, label: 'npm' },
	opentelemetry: { icon: SiOpentelemetry, label: 'OpenTelemetry' },
	postcss: { icon: SiPostcss, label: 'PostCSS' },
	python: { icon: SiPython, label: 'Python' },
	raspberrypi: { icon: FaRaspberryPi, label: 'Raspberry Pi' },
	react: { icon: SiReact, label: 'React' },
	redis: { icon: SiRedis, label: 'Redis' },
	rust: { icon: FaRust, label: 'Rust' },
	sqlite: { icon: SiSqlite, label: 'SQLite' },
	typescript: { icon: SiTypescript, label: 'TypeScript' }
} as const satisfies Record<string, StackIcon>;

export type StackKey = keyof typeof STACK_ICONS;

export function getStackIcon(key: string): StackIcon | null {
	return STACK_ICONS[key as StackKey] ?? null;
}

export function parseStackInput(text: string): string[] {
	return text
		.split(',')
		.map(item => item.trim().toLowerCase())
		.filter(Boolean);
}

export function formatStackInput(keys: string[]): string {
	return keys.join(', ');
}
