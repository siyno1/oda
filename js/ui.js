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



    // tab Event 1
    $('.tab').on('click', 'button', function () {
        let $btn = $(this);
        let $li = $btn.parent();
        let index = $li.index();
        let $tabItems = $('.tabCont').children().removeClass('active');
        let $target = $tabItems.eq(index).addClass('active');

        $li.addClass('active').siblings().removeClass('active');
        $li.find('button').addClass('active');
        $li.siblings().find('button').removeClass('active');

        if ($target.hasClass('depth')) {
            var $depth1 = $target.children().eq(0);
            var $depth2 = $target.children().eq(1);

            $depth1.children().removeClass('active').first().addClass('active');
            $depth2.children().removeClass('active').first().addClass('active');
        }
    });

    // tab Event 2
    $('.tabCont').on('click', '.depth2 button', function () {
        var $btn = $(this);
        var index = $btn.index();

        $btn.addClass('active').siblings().removeClass('active');

        var $depth2Cont = $btn.closest('.depth2').next('.depth2Cont');
        $depth2Cont.children().removeClass('active').eq(index).addClass('active');
    });

    // btn-flt Event
    $('.btn-flt').on('click', function () {
        $(this).toggleClass('on');
        $('.fltList').toggleClass('on');

        if (!$(this).hasClass('on')) {
            $('.fltList li').removeClass('on');
            $('.fltCont li').removeClass('on');
        }
    });

    $('.schBox.de .btn-flt').on('click', function () {
        $(this).children('span').toggleClass('off');
        $(this).parents('.schBox.de').toggleClass('on')
    });

    // fltList btn Event
    $('.fltList button').on('click', function () {
        let $li = $(this).parent();
        let ulIdx = $li.parent().index();
        let liIdx = $li.index();

        let isAlreadyOn = $li.hasClass('on');

        $('.fltList li, .fltCont li').removeClass('on');

        if (!isAlreadyOn) {
            $li.addClass('on');
            $('.fltCont ul').eq(ulIdx).children().eq(liIdx).addClass('on');
        }
    });

    // tbl Chk event
    $('.tbl .tblChk input[type="checkbox"]').on('change', function () {
        $(this).closest('tr').toggleClass('on', this.checked);
    });

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
}

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