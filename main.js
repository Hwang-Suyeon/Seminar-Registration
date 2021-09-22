const $title = document.getElementById('title');
const $submit = document.getElementById('submit');
const $tableBox = document.getElementById('tableBox');
const $file = document.getElementById('file');
let seminar = {
    title: '',
    duty: [],
    location: '',
    fee: ''
};


function countTitleInput() {
    let max = 200;
    let len = 0;
    let total = 0;
    let input = $title.value;
    const $cnt = document.getElementById('cnt');

    for (let i = 0; i < input.length; i++) {
        if (escape(input.charAt(i)).length == 6) { // 한글 -> %uXXXX
            total++;
        }
        total++;
     
        if (total <= max) {
            len++;
        }
    }

    $cnt.innerText = `( ${total} / ${max} )`;
    
    if (total > max) {
        alert(`${max}자까지 입력할 수 있습니다.`);
        $title.value = input.substr(0, len);
        $cnt.innerText = `( ${max} / ${max} )`;
    }
}

function getCheckedValue(name) {
    let arr = [];
    let checkeds = document.querySelectorAll(`input[name=${name}]:checked`);

    for (let i = 0; i < checkeds.length; i++) {
        arr.push(checkeds[i].value);
    }
    return arr;
}

function cehckForm() {
    if ($title.value == "") {
        $title.focus();
        alert('세미나 주제를 입력하세요.');
        return false;
    }

    let fee = getCheckedValue('fee');
    if (fee.length == 0) {
        document.getElementsByName('fee')[0].focus();
        alert('참가비를 선택하세요.');
        return false;
    }

    let sel = document.getElementById("location");
    let location = sel.options[sel.selectedIndex].value;
    if (location == "") {
        sel.focus();
        alert('지역을 선택하세요.');
        return false;
    }

    let duty = getCheckedValue('duty');
    if (duty.length == 0) {
        document.getElementsByName('duty')[0].focus();
        alert('직급을 선택하세요.');
        return false;
    }

    seminar = {
        title: $title.value,
        duty: duty,
        location: location,
        fee: fee
    }
    return true;
}

function createHTMLString() {
    let str = `
    <tr>
        <td class="title">${seminar.title}</td>
        <td>${seminar.duty.join(', ')}</td>
        <td>${seminar.location}</td>
        <td>${seminar.fee}</td>`;
    
    if ($file.files.length == 0) {
        str += `
        <td></td>`;
    } else {
        str += `
        <td><a class="ico-down" href="#"></a></td>`;
    }

    str += `
        <td><a class="ico-trash" href="#" onclick="unregisterSeminar(event)"></a></td>
    </tr>`;
    return str;
}

function unregisterSeminar(event) {
    event.target.parentElement.parentElement.remove();

    const $tbody = document.getElementById('tbody');
    if ($tbody.rows.length == 0) {
        $tableBox.style.display = 'none';
    }
}

function registerSeminar() {
    if (!cehckForm()) {
        return;
    }
    const $tbody = document.getElementById('tbody');
    $tbody.innerHTML = $tbody.innerHTML + createHTMLString();
    $tableBox.style.display = 'block';

    // reset form
    resetField();
}

function resetField() {
    $title.value = '';
    countTitleInput();
    document.querySelectorAll(`input[name=fee]:checked`).forEach(e => e.checked = false);
    document.getElementById("location").value = '';
    document.querySelectorAll(`input[name=duty]:checked`).forEach(e => e.checked = false);
    $file.type = 'text'; $file.type = 'file'; 
    document.getElementById('fileName').innerText = '파일첨부';
}

// main
$tableBox.style.display = 'none';
$title.addEventListener('keyup', countTitleInput);
$submit.addEventListener('click', registerSeminar);
$file.addEventListener('change', function() {
    let fileName = $file.files[0].name;
    document.getElementById('fileName').innerText = fileName;
});
