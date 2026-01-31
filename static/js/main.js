document.addEventListener("DOMContentLoaded", () => {
	// gnb scroll 값에 따라 형태 변화
	const current = $(window).scrollTop();
	const about = $('.about').offset().top;

	if (current > about) {
		$('body').addClass('scroll');
	} 
	else {
		$('body').removeClass('scroll');
	}

	const headerH = $('.header').outerHeight() || 0;
	$("#wrap > section").each(function (i) {
		const sectionTop = $(this).offset().top;
		const sectionHeight = $(this).outerHeight();
		const adjusted = current + headerH + 1; // 헤더 보정 및 경계 오프셋

		if (adjusted >= sectionTop && adjusted < sectionTop + sectionHeight) {
			$('.gnb ul li').eq(i).addClass('on').siblings().removeClass('on')
		}
	});

	$(window).on('scroll', function () {
		const current = $(window).scrollTop();
	
		if (current > about) {
			$('body').addClass('scroll');
		} 
		else {
			$('body').removeClass('scroll');
		}
	
		const headerH = $('.header').outerHeight() || 0;

		$("#wrap > section").each(function (i) {
			const sectionTop = $(this).offset().top;
			const sectionHeight = $(this).outerHeight();
			const adjusted = current + headerH + 1; // 헤더 보정 및 경계 오프셋
		
			if (adjusted >= sectionTop && adjusted < sectionTop + sectionHeight) {
				$('.gnb ul li').eq(i).addClass('on').siblings().removeClass('on')
			}
		});
	});


	// Section1 Home
	// 카운터 애니메이션
	function animateCounter() {
		const counter = document.getElementById('yearCounter');
		const target = 5;
		let current = 0;
		const increment = target / 50;
		
		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				counter.textContent = target;
				clearInterval(timer);
			} else {
				counter.textContent = Math.floor(current);
			}
		}, 30);
	}

	// 타이핑 애니메이션
	const texts = [
		"경험은 보이지 않는 곳에서부터",
		"작은 디테일로 완성됩니다",
	];
	let textIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	let typingSpeed = 100;

	function typeText() {
		const typedElement = document.getElementById('typedText');
		if (!typedElement) return;

		const currentText = texts[textIndex];

		if (!isDeleting && charIndex < currentText.length) {
			typedElement.textContent += currentText.charAt(charIndex);
			charIndex++;
			typingSpeed = 100;
			setTimeout(typeText, typingSpeed);
		} else if (isDeleting && charIndex > 0) {
			typedElement.textContent = currentText.substring(0, charIndex - 1);
			charIndex--;
			typingSpeed = 50;
			setTimeout(typeText, typingSpeed);
		} else if (!isDeleting && charIndex === currentText.length) {
			// 문구 완성 후 2초 대기한 뒤 삭제 시작 (다음 typeText는 이 콜백에서만 예약)
			setTimeout(() => {
				isDeleting = true;
				setTimeout(typeText, typingSpeed);
			}, 2000);
		} else if (isDeleting && charIndex === 0) {
			isDeleting = false;
			textIndex = (textIndex + 1) % texts.length;
			setTimeout(typeText, typingSpeed);
		}
	}

	// 비주얼 텍스트 자식요소 순서대로 나타나기기
	let visualTxtIntroPrepared = false;
	let visualTxtIntroPlayed = false;

	function getVisualTxtChildren() {
		const container = document.querySelector('.visual__txt');
		if (!container) return [];
		return Array.from(container.children);
	}

	function prepareVisualTxtIntro() {
		if (visualTxtIntroPrepared) return;
		const items = getVisualTxtChildren();
		if (!items.length) return;

		visualTxtIntroPrepared = true;

		// load 이벤트(2초 지연) 전까지는 숨김 상태 유지
		if (window.gsap) {
			gsap.set(items, { opacity: 0, y: 24 });
		} else {
			items.forEach((el) => {
				el.style.opacity = '0';
				el.style.transform = 'translateY(24px)';
			});
		}
	}

	function playVisualTxtIntro() {
		if (visualTxtIntroPlayed) return;
		const items = getVisualTxtChildren();
		if (!items.length) return;

		visualTxtIntroPlayed = true;

		if (window.gsap) {
			gsap.to(items, {
				opacity: 1,
				y: 0,
				duration: 0.85,
				ease: "power2.out",
				stagger: 0.48,
				clearProps: "transform"
			});
		} else {
			items.forEach((el, i) => {
				el.style.transitionProperty = 'opacity, transform';
				el.style.transitionDuration = '850ms';
				el.style.transitionTimingFunction = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
				el.style.transitionDelay = `${i * 120}ms`;
			});

			requestAnimationFrame(() => {
				items.forEach((el) => {
					el.style.opacity = '1';
					el.style.transform = 'translateY(0)';
				});
			});
		}
	}

	// 비주얼 텍스트 인트로(초기 숨김) 준비
	prepareVisualTxtIntro();

	
	const frame = document.querySelector('.bg__frame');
	const slash = document.querySelector('.bg__slash');
	function frameAnimation () {
		frame.classList.add('loadCompleted');
	}
	function slashAnimation () {
		slash.classList.add('loadCompleted');
	}

	// 페이지 로드 후 애니메이션 시작
	window.addEventListener('load', () => {
		setTimeout(frameAnimation, 1000);
		setTimeout(slashAnimation, 1600)
		
		setTimeout(playVisualTxtIntro, 2600);
		setTimeout(typeText, 3000);
		setTimeout(animateCounter, 3000);
	});


	// Section 2
	// gsap 가로 스크롤
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	const horizontal = document.querySelector(".horizontal");
	const sections = gsap.utils.toArray(".horizontal > .section");
	const aboutSections = document.querySelectorAll('.about .section');
	const mm = gsap.matchMedia();

	function initAnimation() {
		mm.add("(min-width: 960px)", () => {
			// 기본값
			gsap.set(horizontal, { display: "flex" });
			sections.forEach((s) => gsap.set(s, { width: `${100 / sections.length}%`, flexShrink: 0 }));

			// 타임라인
			const horizontalScroll = gsap.to(sections, {
				xPercent: -100 * (sections.length - 1),
				ease: "none",
				scrollTrigger: {
					trigger: horizontal,
					start: "top top",
					end: () => "+=" + (horizontal.offsetWidth - innerWidth),
					pin: true,
					scrub: 1,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					snap: {
						snapTo: 1 / (sections.length - 1),
						inertia: { x: 500, y: -300 },
						delay: 1,
						duration: { min: 0.6, max: 2 },
						ease: 'power1.inOut'
					}
				}
			});

			// 각 .section  속 텍스트 애니메이션들 생성
			const created = [];
			aboutSections.forEach((section) => {
				const transforms = section.querySelectorAll('.transform');
				const desc = section.querySelectorAll('.desc > p');
				// 화면 크기에 따라 y 값 변경
				const yValue = window.innerWidth >= 1200 ? -87 : -74;

				const t1 = gsap.to(transforms, {
					y: yValue,
					duration: 0.6,
					ease: "power3.inOut",
					stagger: { each: 0.5, from: "random" },
					repeat: -1,
					yoyo: true,
					repeatDelay: 0,
					scrollTrigger: {
						trigger: section,
						containerAnimation: horizontalScroll,
						start: "left center",
						end: "right center",
						toggleActions: "play reverse play reverse",
					},
				});

				const t2 = gsap.from(desc, {
					y: -100,
					opacity: 0,
					duration: 1,
					stagger: { each: 0.5, from: "top" },
					scrollTrigger: {
						trigger: section,
						containerAnimation: horizontalScroll,
						start: "left center",
						end: "right center",
						toggleActions: "play reverse play reverse",
					},
				});

				created.push(t1, t2);
			});

			// 961px 미만일 때 실행
			return () => {
				created.forEach(t => t.kill());
				horizontalScroll && horizontalScroll.kill();

				// inline 스타일 제거 (원상복구)
				gsap.set(horizontal, { clearProps: "all" });
				sections.forEach(s => gsap.set(s, { clearProps: "all" }));
				
				// ScrollTrigger 상태 갱신
				ScrollTrigger.refresh();
			};
		});
	}

	initAnimation();





	// Section 3 
	// 아코미언 메뉴
	// const experience = $('.experience__item');
	// experience.find('.body').hide();

	// $('.experience__item.on').find('.body').slideDown();
	// $('.experience__item.on').find('.date > i').addClass('opened').attr('aria-label', '상세 설명 닫기');

	// experience.find('button').on('click', function () {
	// 	const $parent = $(this).parent();
	// 	const isOpen = $parent.hasClass('on');

	// 	if (isOpen) {
	// 		$parent.removeClass('on').find('.body').slideUp();
	// 		$parent.find('.date > i').removeClass('opened').attr('aria-label', '상세 설명 열기');
	// 	} 
	// 	else {
	// 		experience.removeClass('on').find('.body').slideUp();
	// 		experience.find('.date > i').removeClass('opened').attr('aria-label', '상세 설명 열기');

	// 		$parent.addClass('on').find('.body').slideDown();
	// 		$parent.find('.date > i').addClass('opened').attr('aria-label', '상세 설명 닫기');
	// 	}
	// });


	gsap.from(".marker", {
		width: 0,
		transformOrigin: "left center", 
		ease: 'power1.inOut',
		scrollTrigger: {
			trigger: ".experience",
			scrub: true,
			start: "top +=20%",
			end: "bottom +=100%",
		},

	});


	//프로젝트 필더링
	const tabButton = document.querySelectorAll('.tab-button');
	const projectItem = document.querySelectorAll('.project-item');

	tabButton.forEach(button => {
		button.addEventListener('click', () => {
			// 버튼 활성화
			tabButton.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');

			const filter = button.getAttribute('data-filter');
			let visibleCount = 0;

			// 카드 필터링
			projectItem.forEach(card => {
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




	// // Section 4 
	// // swiper
	// document.querySelectorAll(".screen").forEach((screenEl) => {
	// 	const thumbs = screenEl.querySelector(".swiper-thumbs");
	// 	const main = screenEl.querySelector(".swiper-main");
	  
	// 	const swiperThumbs = new Swiper(thumbs, {
	// 		spaceBetween: 12,
	// 		slidesPerView: "auto",
	// 		watchSlidesProgress: true,
	// 		allowTouchMove: false,
	// 		observer: true,
	// 		observeParents: true,
	// 		// breakpoints: {
	// 		// 	768: {
	// 		// 		slidesPerView: 4,
	// 		// 	}
	// 	 	//  }
	// 	});
	  
	// 	const swiperMain = new Swiper(main, {
	// 	  spaceBetween: 10,
	// 	  navigation: {
	// 			nextEl: screenEl.querySelector(".swiper-button-next"),
	// 			prevEl: screenEl.querySelector(".swiper-button-prev"),
	// 		},
	// 		thumbs: {
	// 			swiper: swiperThumbs,
	// 		},
	// 	});
	// });
	
	// // 프로젝트 상세 열기
	// $('.work__list ul li').on('click', function(){
	// 	let workInx = $(this).index();
		
	// 	$('.work__list').css('display','none');
	// 	$('.work__view').css('display','flex');
	// 	$('.work__view > div').eq(workInx).css({'display':'block'});

	// 	$('body').addClass('fixed');
	// });

	// // 프로젝트 상세 닫기
	// $('.b-close').on('click', function(){
		
	// 	$('.work__list').css('display','block');
	// 	$('.work__view').css('display','none');
	// 	$('.work__view > div').css('display','none');

	// 	$('body').removeClass('fixed');

	// });


	// resize
	window.addEventListener('resize', () => {
		mm.revert(); //기존 애니메이션 & ScrollTrigger 정리
		initAnimation();
	});
});//doc end