$(document).ready(function() {
    $('#student_grade').attr('type', 'number');
    $('.add_button').click(addClicked);
    $('.cancel_button').click(cancelClicked);
    $('.update_button').hide();
    $('#edit_student_header').hide();
    $('.cancel_edit').hide();
    applyClickHandlers();
});

function applyClickHandlers(){
    $('tbody').on('click', 'button.delete_button', function(){
        removeStudent(event);
    });

    $('div').on('click', 'button.update_button', function(){
        changeStudentInfo(row_being_changed);
    });

    $('div').on('click', 'button.cancel_edit', function(){
        cancelEditStudent();
    })
}


let student_array = [];
let in_edit_mode = false;
let row_being_changed = null;

function addClicked(){
    addStudent();
    clearAddStudentForm();
    updateData();
}

function cancelClicked(){
    clearAddStudentForm();
}

function cancelEditStudent(){
    clearAddStudentForm();
    show_original_elements();
    updateData();
}

function addStudent(){
    let name = $('#student_name').val();
    let course = $('#student_course').val();
    let grade = $('#student_grade').val();
    let new_student_obj = {
        name: name,
        course: course,
        grade: grade
    };
    if(name === '' || course === '' || grade === ''){
        return;
    }
    if(grade < 0){
        return;
    }
    student_array.push(new_student_obj);
}

function clearAddStudentForm(){
    $('#student_name').val('');
    $('#student_course').val('');
    $('#student_grade').val('');
}

function calculateAverage(arr){
    // shows average into span with all students combined average
    let result = [];
    let total = 0;
    for(let i = 0; i < arr.length; i++){
        result.push(arr[i].grade);
        total += parseFloat(arr[i].grade);
    }
    let avg = total / arr.length;
    $('.avgGrade').text(Math.round(avg));
    if(isNaN(avg)){
        $('.avgGrade').text('0');
    }
    return avg;
}

function updateData(){
    updateStudentList(student_array);
    calculateAverage(student_array);
}

function updateStudentList(arr){
    $('tbody').empty();
    for(let i = 0; i < arr.length; i++){
        addStudentToDom(arr[i]);
    }
    //call the addStudentToDom function over and over that way we only add in students one way
}

function addStudentToDom(studentObj){
    let new_row = $('<tr>');
    let name = $('<td>').text(studentObj.name).addClass('name');
    let course = $('<td>').text(studentObj.course).addClass('course');
    let grade = $('<td>').text(studentObj.grade).addClass('grade');
    let delete_button = $('<button>').attr('type', 'button').addClass('delete_button btn btn-danger').text('Delete');
    let edit_button = $('<button>').attr('type', 'button').click(editStudent).addClass('edit_button btn btn-primary').text('Update');
    new_row.append(name, course, grade, delete_button, edit_button);
    $('tbody').append(new_row);
}

function reset(){
    student_array = [];
    clearAddStudentForm();
    $('tbody').empty();
}

function removeStudent(event){
    let row = $(event.target).parent();
    row = row[0].rowIndex;
    student_array.splice(row-1, 1);
    updateData();
}

function changeStudentInfo(){
    updateStudentInfo(row_being_changed);
    clearAddStudentForm();
    updateData();
    show_original_elements();
}

function updateStudentInfo(row_being_changed){
    let name = $('#student_name').val();
    let course = $('#student_course').val();
    let grade = $('#student_grade').val();
    if(name === '' || course === '' || grade === ''){
        return;
    }
    if(grade < 0){
        return;
    }
    for(let i = 0; i< student_array.length; i++){
        if(student_array[i].name == row_being_changed[0].children[0].textContent &&
            student_array[i].grade == row_being_changed[0].children[2].textContent){
                student_array[i].name = name;
                student_array[i].course = course;
                student_array[i].grade = grade;
        }
    }
}

function editStudent(){
    let row = $(event.target).parent();
    row_being_changed = row;
    in_edit_mode = true;
    let name = row[0].children[0].textContent;
    let course = row[0].children[1].textContent;
    let grade = row[0].children[2].textContent;
    let delete_button = row[0].children[3];
    $(this).hide();
    $(delete_button).hide();
    $('#student_name').val(name);
    $('#student_course').val(course);
    $('#student_grade').val(grade);
    $('#edit_student_header').show().text('Edit Student ' + name);
    show_edit_student_elements();
}

function show_edit_student_elements(){
    $('#add_student_header, .cancel_button, .add_button').hide();
    $('.cancel_edit, .update_button').show();
    $('.delete_button').prop('disabled', true);
    $('.edit_button').prop('disabled', true);
}

function show_original_elements(){
    $('#add_student_header, .cancel_button, .add_button, .delete_button, .edit_button').show();
    $('#edit_student_header, .cancel_edit, .update_button').hide();
}


