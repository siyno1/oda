// Jquery Document
$(document).ready(function () {
    init();
});

function init() {
    // flatpickr Plugin
    var pickrs = document.querySelectorAll('.pickr');
    pickrs.forEach(function (pickr) {
        var mode = pickr.getAttribute('data-mode');
        var options = {
            locale: 'ko',
            dateFormat: 'Y-m-d',
            onReady: function (selectedDates, dateStr, instance) {
                replaceYearWithSelect(instance);
            },
            onOpen: function (selectedDates, dateStr, instance) {
                replaceYearWithSelect(instance);
            },
            onYearChange : function (selectedDates, dateStr, instance) {
                var yearSelect = this.calendarContainer.querySelector('.flatpickr-yearDropdown-years');
                if (yearSelect) {
                    var options = yearSelect.querySelectorAll('option');
                    options.forEach(function(option){
                        option.selected = option.value == instance.currentYear;
                    });
                }
            }
        }

        if (mode == 'month') {
            options = {
                locale: 'ko',
                mode: "single", // 단일 날짜 선택 모드
                plugins: [
                    new monthSelectPlugin({
                        shorthand: true,
                        dateFormat: "Y-m", // 선택된 날짜 형식 'YYYY-MM'
                        altFormat: "F Y"
                    })
                ],
                onReady: function (selectedDates, dateStr, instance) {
                    replaceYearWithSelect(instance);
                },
                onOpen: function (selectedDates, dateStr, instance) {
                    replaceYearWithSelect(instance);
                },
                onYearChange : function (selectedDates, dateStr, instance) {
                    var yearSelect = this.calendarContainer.querySelector('.flatpickr-yearDropdown-years');
                    if (yearSelect) {
                        var options = yearSelect.querySelectorAll('option');
                        options.forEach(function(option){
                            option.selected = option.value == instance.currentYear;
                        });
                    }
                }
            }
        }

        $(pickr).flatpickr(options);
    });



    // // tab Event 1
    // $('.tab').on('click', 'button', function () {
	// 	console.log('aaaa');
    //     let $btn = $(this);
	// 	let $tabBox = $btn.closest('.tabBox');
    //     let $li = $btn.parent();
    //     let index = $li.index();
    //     let $tabConts = $tabBox.children('.tabCont');

    //     $tabConts.each(function(idx, $tabCont){
    //         let $tabItems = $($tabCont).children().removeClass('active');
    //         let $target = $tabItems.eq(index).addClass('active');

    //         if ($target.hasClass('depth')) {
    //             var $depth1 = $target.children().eq(0);
    //             var $depth2 = $target.children().eq(1);

    //             $depth1.children().removeClass('active').first().addClass('active');
    //             $depth2.children().removeClass('active').first().addClass('active');
    //         }
    //     });

    //     $li.addClass('active').siblings().removeClass('active');
    //     $li.find('button').addClass('active');
    //     $li.siblings().find('button').removeClass('active');
    // });

    // // tab Event 2
    // $('.tabCont').on('click', '.depth2 button', function () {
    //     var $btn = $(this);
    //     var index = $btn.index();

    //     $btn.addClass('active').siblings().removeClass('active');

    //     var $depth2Cont = $btn.closest('li').find('.depth2Cont');
    //     $depth2Cont.children().removeClass('active').eq(index).addClass('active');
    // });

	/**
	 * 탭 관련 스크립트
	 */
	$('[data-tabBtn]').on('click', function(event){
		var $button = $(this);
		var tabBtn = $button.attr('data-tabBtn') ? $button.attr('data-tabBtn') : '';
		var tabName = tabBtn.split('-')[0];

		if (tabName) {
			$('[data-tabBtn^='+tabName+'-]').removeClass('active');
			$('[data-tabCont^='+tabName+'-]').removeClass('active');

			$button.addClass('active');
			$('[data-tabCont='+tabBtn+']').addClass('active');
		}
	});

    // btn-flt Event
    $('.btn-flt').on('click', function () {
		var $this = $(this);
		$this.toggleClass('on');

		if ($this.hasClass('on')) {
			$('.toggleFlt').css('display','');
		} else {
			$('.toggleFlt').css('display','none');
		}
    });


    // fltList btn Event
    $('.fltList button').on('click', function () {
		var $this = $(this);
        var $li = $this.parent();
		var $schBox = $this.closest('.schBox');
		var $allBtns = $schBox.find('.fltList button');
        var btnIndex = $allBtns.index(this);
		var $toggleFltCont = $schBox.find('.toggleFltCont');
		var isAlreadyOn = $li.hasClass('on');

		$schBox.find('.fltList li').removeClass('on');
		$toggleFltCont.find('li').removeClass('on');

		if (!isAlreadyOn) {
			$li.addClass('on');
			$toggleFltCont.find('ul').eq(0).children().eq(btnIndex).addClass('on');
		}

		var toggleFltContDisplay = $toggleFltCont.find('li.on').length ? '' : 'none';
		$toggleFltCont.css('display',toggleFltContDisplay);
    });

    // tbl Chk event
	/**
	 * 2025.08.14 다른 CASE 많아서 주석처리함
	 */
    // $('.tbl .tblChk input[type="checkbox"]').on('change', function () {
    //     $(this).closest('tr').toggleClass('on', this.checked);
    // });

    // contList btn Event
    $('.contList button').on('click', function () {
        $(this).toggleClass('on');
    });

    // searchBox input[type="text"] clear
    $('#iptTxt').on('input', function () {
        $('.btn-ipt').toggle(!!$(this).val().trim());
    }).trigger('input');

    $('.btn-ipt').on('click', () => $('#iptTxt').val('').trigger('input'));

    $('.mapList a').on('click', function () {
        $(this).toggleClass('on');
    });

    // popup Open btn
    $('button.pop').on('click', e => {
        $('#' + $(e.currentTarget).data('target')).fadeIn(300);
        $('.dim').fadeIn(300);
    });

    // popup Close btn
    $('.popup').on('click', '.btn-close, .close', e => {
        $(e.currentTarget).closest('.popup').fadeOut(300);
        $('.dim').fadeOut(300);
    });

    // toggleBox btn
    $('.toggleBox button').on('click', function () {
        $(this).parent().toggleClass('on');
    });

    //연관검색
    if ($('input[data-match=TRUE]').length) {
        $('input[data-match=TRUE]').each(function(){
            var $this = $(this);
            var $keywords = $this.next('.keywords');
            var $empty = $keywords.find('.empty');

            if ($keywords) {
                $this.on("input", function(){
                    var value = $this.val().trim();
                    var valueInitials = getInitials(value);
                    var valueLen = value.length;
                    var matchesLen = 0;

                    $keywords.find('li').each(function() {
                        var $keyword = $(this);
                        var $keywordChild = $keyword.find('button');
                        if (valueLen) {
                            var text = $keywordChild.text();
                            var textInitials = getInitials(text);
                            if (text.includes(value) || textInitials.includes(valueInitials)) {
                                $keyword.css('display', '');
                                matchesLen++;
                            } else {
                                $keyword.css('display', 'none');
                            }
                        } else {
                            matchesLen = 1;
                            $keyword.css('display', '');
                        }
                    });

                    if (matchesLen === 0) {
                        $empty.css('display', 'block');
                    } else {
                        $empty.css('display', '');
                    }
                });

                $keywords.find('button').on("click", function(){
                    var $keyword = $(this);
                    $this.val($keyword.text());
                    $keyword.blur();
                });
            }
        });
    }

	//툴팁
	$('[data-tt]').on("click", function(event){
		event.stopPropagation();

		const $trigger = $(this);
		const ttNum = $trigger.attr('data-tt');
		const $tooltip = $('[data-ttc="' + ttNum + '"]');
		const $container = $('.container');

		$('[data-ttc]').hide();

		// 기본 위치: 아래에 툴팁
		let directionClass = []; // 꼬리는 위를 향함

		const containerOffset = $container.offset();
		const triggerOffset = $trigger.offset();
		const scrollTop = $container.scrollTop();

		const relativeTop = triggerOffset.top - containerOffset.top + scrollTop;
		const relativeLeft = triggerOffset.left - containerOffset.left;

		$tooltip.css({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		});
		const tooltipWidth = $tooltip.outerWidth();
		const tooltipHeight = $tooltip.outerHeight();
		$tooltip.css({
			visibility: 'visible'
		});

		const containerWidth = $container.innerWidth();
		const containerHeight = $container.innerHeight();

		// 기본 위치
		let tooltipTop = relativeTop + $trigger.outerHeight() + 6;
		let tooltipLeft = relativeLeft - 6;

		// 반전 조건 확인
		const spaceBelow = containerHeight - (relativeTop + $trigger.outerHeight());
		const spaceAbove = relativeTop;
		const spaceRight = containerWidth - (relativeLeft + tooltipWidth);
		const spaceLeft = relativeLeft;

		// 아래가 부족하고 위가 넉넉하면 → 위로 반전
		if (spaceBelow < tooltipHeight && spaceAbove >= tooltipHeight + 6) {
			tooltipTop = relativeTop - tooltipHeight - 6;
			directionClass.push('top');
		}

		// 오른쪽 넘치면 왼쪽으로 반전
		if (spaceRight < 0 && spaceLeft >= tooltipWidth) {
			tooltipLeft = relativeLeft - tooltipWidth + $trigger.outerWidth() + 6;
			directionClass.push('left');
		}

		// 방향 클래스 업데이트
		if (directionClass.length) $tooltip.addClass(directionClass.join(' '));
		else $tooltip.removeClass('top left');

		// 위치 적용
		$tooltip.css({
			top: tooltipTop + 'px',
			left: tooltipLeft + 'px',
			display: 'block'
		});

		// 외부 클릭 시 닫기
		$(document).off('click.tt-close').on('click.tt-close', function (e) {
			if (!$(e.target).closest('[data-tt], [data-ttc]').length) {
				$('[data-ttc]').hide();
				$(document).off('click.tt-close');
			}
		});
	});


	//답글 입력창 열기
	if ($('.commentToggle button').length) {
		$('.commentToggle button').on('click', function(){
			$commentLi = $(this).closest('li');
			if ($commentLi.children('.commentForm').length) {
				$commentLi.children('.commentForm').toggle();
			}
		});
	}
}// @@init

// pickr year input => select[Transform]
function replaceYearWithSelect(instance) {
    var container = instance.calendarContainer;
    var yearInputWrapper = container.querySelector(".flatpickr-current-month .numInputWrapper");

    if (!yearInputWrapper || yearInputWrapper.querySelector("select")) return;

    var input = yearInputWrapper.querySelector("input");
    var currentYear = instance.currentYear;

    // year Range
    var minYear = 1990;
    var maxYear = 2035;

    // input Delete
    input.style.display = "none";

    // select[Transform]
    var yearSelect = document.createElement("select");
    yearSelect.className = 'flatpickr-yearDropdown-years';
    for (let y = minYear; y <= maxYear; y++) {
        var opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y + "년";
        if (y === currentYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }

    yearSelect.addEventListener("change", function () {
        var newYear = parseInt(this.value);
        instance.changeYear(newYear);
    });

    yearInputWrapper.appendChild(yearSelect);
}

// SIDE(LNB)
$('.btnSlide').on('click', function () {
    $('#wrap').toggleClass('showMenu');
})

$('.side .gnb a').on('click', function () {
    $(this).parent().toggleClass('active');
});

// USERBOX
$('.userBox .btnUser').on('click', function () {
    $(this).parent('.userBox').toggleClass('active');
})

// 초성 추출 함수
function getInitials(str) {
    var CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    let result = '';
    for (let i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i) - 44032;
        if (code >= 0 && code <= 11171) {
            result += CHO[Math.floor(code / 588)];
        } else {
            result += str[i];
        }
    }
    return result;
}