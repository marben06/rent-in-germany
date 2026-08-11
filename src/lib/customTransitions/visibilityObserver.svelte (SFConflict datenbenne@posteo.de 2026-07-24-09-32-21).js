
export function useVisibilityObserver(element) {
	
    const isVisible = $state(false);

	const observer = new IntersectionObserver(([entry]) => {
		isVisible.set(entry.isIntersecting);
	});

	if (element) observer.observe(element);

	return { isVisible };
}