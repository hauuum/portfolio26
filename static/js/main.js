document.addEventListener("DOMContentLoaded", () => {

	gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

	// Section 1, home
	// 텍스트 split 사용
	const targets = gsap.utils.toArray(".split");

	function splitAnimated () {
		targets.forEach(target => {
			let SplitClient = new SplitType(target, {type: "lines, words, chars"});
			let chars = SplitClient.chars;

			gsap.set(target, { opacity: 1 });

			gsap.from(chars, {
				yPercent: 100,
				autoAlpha: 0,
				opacity: 0,
				duration: 1.2,
				ease: "circ.out",
				stagger: {
					amount: 1,
					from : "random"
				},
				scrollTrigger: {
					trigger: target,
					start: "top bottom",
					end: "+=400",
					markers: false
				}
			 });

		 });
	}
	function btnAnimated () {
		gsap.to(".btn-wrap", {
			y: 0, 
			duration: 1.6,
			opacity: 1,
			ease: "power1.inOut"
		});
	}
	setTimeout(splitAnimated, 600);
	setTimeout(btnAnimated, 1600);

	// 스킬바
	gsap.utils.toArray('.skill-category').forEach((category, index) => {
		gsap.from(category, {
			scrollTrigger: {
				trigger: category,
				start: 'top 80%',
				end: 'top 50%',
				toggleActions: 'play none none none',
			},
			opacity: 0,
			y: 50,
			duration: 0.8,
			ease: 'power3.out',
			delay: index * 0.1
		});
		
		const skillBars = category.querySelectorAll('.bar');

		skillBars.forEach((bar, barIndex) => {
			const targetWidth = bar.getAttribute('data-width');
			
			gsap.fromTo(bar,
				{ width: '0%' },
				{
					scrollTrigger: {
						trigger: category,
						start: 'top 70%',
						toggleActions: 'play none none none',
					},
					width: targetWidth + '%',
					duration: 1.2,
					ease: 'power2.out',
					delay: 0.3 + (barIndex * 0.1)
				}
			);
		});

		gsap.utils.toArray('.state-card').forEach((card, index) => {
			const numberElement = card.querySelector('.number');
			const target = parseInt(numberElement.getAttribute('data-target'));

			gsap.from(card, {
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
				opacity: 0,
				y: 30,
				duration: 0.6,
				ease: 'power2.out',
				delay: index * 0.1
			});

			gsap.from({ value: 0 }, {
				scrollTrigger: {
					trigger: card,
					start: 'top 75%',
					toggleActions: 'play none none none',
				},
				value: target,
				duration: 2,
				ease: 'power2.out',
				delay: 0.3,
				onUpdate: function() {
					numberElement.textContent = Math.floor(this.targets()[0].value).toLocaleString();
				},
				onComplete: function() {
					numberElement.textContent = target.toLocaleString();
				}
			});
		});
	});

	

	// Section 2, experience
	gsap.utils.toArray('.timeline-item').forEach((item, index) => {
		gsap.from(item, {
			scrollTrigger: {
				trigger: item,
				start: 'top 75%',
				toggleActions: 'play none none none',
			},
			opacity: 0,
			y: 80,
			duration: 0.4,
			ease: 'power3.out',
			delay: index * 0.15
		});

		const dot = item.querySelector('.timeline-dot');
		gsap.from(dot, {
			scrollTrigger: {
				trigger: item,
				start: 'top 55%',
				toggleActions: 'play none none none',
			},
			scale: 0,
			opacity: 0,
			duration: 0.5,
			ease: 'back.out(1.7)',
			delay: index * 0.15 + 0.3
		});
	});



	//Section 3, work
	const filterButtons = document.querySelectorAll('.filter-button');
	const projectItems = document.querySelectorAll('.project-item');

	filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			filterButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');

			const filter = button.getAttribute('data-filter');
			let visibleCount = 0;

			// 필터링
			projectItems.forEach(card => {
				const tags = card.getAttribute('data-tags');
				
				if (filter === 'all' || tags.includes(filter)) {
					card.classList.remove('hidden');
					visibleCount++;
				} else {
					card.classList.add('hidden');
				}
			});
			
		});
	});

	// Footer 스크롤 도달하면 물결치기
	const down 		= 'M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z';
	const center 	= 'M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z';

	ScrollTrigger.create({
		trigger: '.footer',
		start: 'top bottom',
		toggleActions: 'play pause resume reverse',
		onEnter: self => {
			const velocity = self.getVelocity(); // 스크롤 속도 계산
			const variation = velocity / 20000; // 속도를 수치로 정규화

			gsap.fromTo('#bouncy-path', { morphSVG: down}, 
			{
				duration: 3, 
				morphSVG: center, 
				ease: `elastic.out(${1 + variation}, ${1 - variation})`,  // 탄성 수치
				overwrite: 'true'
			});
		}
	});

	function handleScroll() {
		const body = document.body;
		const about = document.querySelector('.about');
		const header = document.querySelector('.header');
		const sections = document.querySelectorAll('main > section');
		const gnbItems = document.querySelectorAll('.gnb ul li');
	  
		const current = window.scrollY;
		const aboutTop = about?.offsetTop || 0;
		const headerH = header?.offsetHeight || 0;
	  
		// body 클래스 토글 (about 기준)
		if (current > aboutTop) {
		  body.classList.add('scroll');
		} else {
		  body.classList.remove('scroll');
		}
	  
		// 각 섹션 확인
		const adjusted = current + headerH + 1;
	  
		sections.forEach((section, i) => {
		  const sectionTop = section.offsetTop;
		  const sectionHeight = section.offsetHeight;
	  
			if (adjusted >= sectionTop && adjusted < sectionTop + sectionHeight) {

				gnbItems[i]?.classList.add('on');

				gnbItems.forEach((item, idx) => {
					if (idx !== i) {
						item.classList.remove('on');
					}
				});
			}
		});
	}
	
	handleScroll();
	
	window.addEventListener('scroll', handleScroll, { passive: true });

	
});//doc end