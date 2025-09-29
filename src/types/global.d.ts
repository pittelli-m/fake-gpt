/// <reference types="nativewind/types" />
/// <reference types="react" />
/// <reference types="react-native" />

declare module "*.css" {
	const content: Record<string, unknown>;
	export default content;
}
