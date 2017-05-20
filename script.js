$(document).ready(function() {
    $('#student_grade').attr('type', 'number');
    $('.add_button').click(addClicked);
    $('.cancel_button').click(cancelClicked);
    deleteStudent();
    get_data_from_server();
});

let student_array = [];

function addClicked(){
    //call addstudent
    addStudent();
    //call clearaddstudentform
    clearAddStudentForm();
    //call updateStudentList
    updateData();
}

function cancelClicked(){
    //call clearAddStudentForm
    clearAddStudentForm();
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
    let name = $('<td>').text(studentObj.name);
    let course = $('<td>').text(studentObj.course);
    let grade = $('<td>').text(studentObj.grade);
    let delete_button = $('<button>').attr('type', 'button').addClass('delete_button btn btn-danger').text('Delete');
    let edit_button = $('<button>').attr('type', 'button').click(editStudent).addClass('edit_button btn btn-success').text('Edit');
    new_row.append(name, course, grade, delete_button, edit_button);
    $('tbody').append(new_row);
}

function reset(){
    student_array = [];
    clearAddStudentForm();
    $('tbody').empty();
}

function deleteStudent(){
    $('tbody').on('click', 'button', function(){
        removeStudent(event);
    })
}

function removeStudent(event){
    let row = $(event.target).parent();
    row = row[0].rowIndex;
    student_array.splice(row-1, 1);
    updateData();
}

function editStudent(){

}


function get_data_from_server(){
    $('.data_button').click(function(){
        $.ajax({
            data: {'api_key': '8KyFdlyzfV' },
            dataType: 'json',
            url: 'http://s-apis.learningfuze.com/sgt/get',
            method: "POST",
            success: function(result) {
                console.log('AJAX Success function called, with the following result:', result);
                student_array = student_array.concat(result.data);
                updateData();
            },
            error: function () {
                console.log('error');
            }
        });
    });
}


