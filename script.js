$(document).ready(function() {
    $('#student_grade').attr('type', 'number');
    $('.add_button').click(add_clicked);
    $('.cancel_button').click(cancel_clicked);
    $('.update_button').hide();
    $('#edit_student_header').hide();
    $('.cancel_edit').hide();
    apply_click_handlers();
    update_data();
});

/*Apply click handler to DOM elements to ensure correct functionality*/
function apply_click_handlers(){
    $('tbody').on('click', 'button.delete_button', function(){
        remove_student(event);
    });

    $('div').on('click', 'button.update_button', function(){
        change_student_info(row_being_changed);
    });

    $('div').on('click', 'button.cancel_edit', function(){
        cancel_edit_student();
    })
}

/*Global Variables to keep state of application in line.*/
let student_array = [
    { name: 'John Yosas', course: 'ReactJS', grade: 90 },
    { name: 'Ashlee Flores', course: 'Court System', grade: 95 },
    { name: 'Andy Ong', course: 'Node.js', grade: 98 },
    { name: 'Thomas Verne', course: 'Economics', grade: 66 },
    { name: 'Jessica Wright', course: 'Business', grade: 78 },
];
let in_edit_mode = false;
let row_being_changed = null;

/*Runs every time the add button has been clicked*/
function add_clicked(){
    add_student();
    clear_add_student_form();
    update_data();
}

function cancel_clicked(){
    clear_add_student_form();
}

function cancel_edit_student(){
    clear_add_student_form();
    show_original_elements();
    update_data();
}

/*Adds new student to the DOM as well as the student_array*/
function add_student(){
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

/*Clears form*/
function clear_add_student_form(){
    $('#student_name').val('');
    $('#student_course').val('');
    $('#student_grade').val('');
}

/*Function to grab to grade of every student in the student_array to find the average of all the students.*/
function calculate_average(arr){
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

/*Updates and displays the information on the application.*/
function update_data(){
    update_student_list(student_array);
    calculate_average(student_array);
}

function update_student_list(arr){
    $('tbody').empty();
    for(let i = 0; i < arr.length; i++){
        add_student_to_dom(arr[i]);
    }
}

function add_student_to_dom(studentObj){
    let new_row = $('<tr>');
    let name = $('<td>').text(studentObj.name).addClass('name');
    let course = $('<td>').text(studentObj.course).addClass('course');
    let grade = $('<td>').text(studentObj.grade).addClass('grade');
    let delete_button = $('<button>').attr('type', 'button').addClass('delete_button btn btn-danger').text('Delete');
    let edit_button = $('<button>').attr('type', 'button').click(edit_student).addClass('edit_button btn btn-primary').text('Update');
    new_row.append(name, course, grade, delete_button, edit_button);
    $('tbody').append(new_row);
}

function reset(){
    student_array = [];
    clear_add_student_form();
    $('tbody').empty();
}

/*Removes student from the table.*/
function remove_student(event){
    let row = $(event.target).parent();
    row = row[0].rowIndex;
    student_array.splice(row-1, 1);
    update_data();
}

function change_student_info(){
    update_student_info(row_being_changed);
    clear_add_student_form();
    update_data();
    show_original_elements();
}

/*changes student information. O(n)*/
function update_student_info(row_being_changed){
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

/*hides add student elements in exhange for edit student of the particular student whos information needs to be changed
also displays the students information in the form.*/
function edit_student(){
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