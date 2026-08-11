<script>

  import { scrollY } from "svelte/reactivity/window";
	
	let scrollProgress = $state(0);

	$effect(() => {
		const handleScroll = () => {
			const scrollTop = document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			scrollProgress = (scrollTop / scrollHeight) * 100;
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>



<header class="progress-container">
  <div class="progress-bar" style:width={`${scrollY}%`}></div>
</header>

<style>
  .progress-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 6px;
    width: 100%;
    background-color: transparent;
    z-index: 9999;
  }

  .progress-bar {
    height: 100%;
    background-color: #ca3f2d; 
    transition: width 0.1s ease-out;
  }

  
</style>
