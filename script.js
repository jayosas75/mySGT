/**
 * Listen for the document to load and reset the data to the initial state
 */

$(document).ready(function() {
    $('#student_grade').attr('type', 'number');
    $('.add_button').click(addClicked);
    $('.cancel_button').click(cancelClicked);
    deleteStudent();
    $('.data_button').click(get_data_from_server);

    $('body').on('keypress', function(e) {
        if (e.key == 'Enter') {
            addClicked();
        }
    });

});
/**

 * Define all global variables here
 */

/**
 * student_array - global array to hold student objects
 * @type {Array} or Obj
 */
var student_array = [];
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = null;
const API_KEY = '8KyFdlyzfV';

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked(newData){
    //console.log('add button clicked');
    //call addstudent
    addStudent();
    //call clearaddstudentform
    clearAddStudentForm();
    //call updateStudentList
    updateData();
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(){
    //call clearAddStudentForm
    clearAddStudentForm();
}

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    var name = $('#student_name').val();
    var course = $('#student_course').val();
    var grade = $('#student_grade').val();
    var new_student_obj = {
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
    //student_array.push(new_student_obj);
    sendStudentToDatabase(new_student_obj);
}

function sendStudentToDatabase(studentObj) {
    $.ajax({
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        dataType: 'json',
        data: {
            'api_key': '8KyFdlyzfV',
            'name': studentObj.name,
            'course': studentObj.course,
            'grade': studentObj.grade
        },
        success: function(body) {
            console.log(body);
            get_data_from_server();
        },
        error: function(err) {
            console.log(err);
        }
    })
}


/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    $('#student_name').val('');
    $('#student_course').val('');
    $('#student_grade').val('');
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(arr){
    // shows average into span with all students combined average
    var result = [];
    var total = 0;
    for(var i = 0; i < arr.length; i++){
        result.push(arr[i].grade);
        total += parseFloat(arr[i].grade);
    }
    var avg = total / arr.length;
    $('.avgGrade').text(Math.round(avg));
    if(isNaN(avg)){
        $('.avgGrade').text('0');
    }
    return avg;
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(){
    updateStudentList(student_array);
    calculateAverage(student_array);
    //renumberIdentification();
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(arr){
    $('tbody').empty();
    for(var i = 0; i < arr.length; i++){
        addStudentToDom(arr[i]);
    }
    //call the addStudentToDom function over and over that way we only add in students one way
}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj){
    var new_row = $('<tr>');
    var name = $('<td>').text(studentObj.name);
    var course = $('<td>').text(studentObj.course);
    var grade = $('<td>').text(studentObj.grade);
    var delete_button = $('<button>').attr('type', 'button').addClass('delete_button btn btn-danger').text('Delete');
    new_row.append(name, course, grade, delete_button);
    $('tbody').append(new_row);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
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
    var row = $(event.target).parent();
    row = row[0].rowIndex;
    //student_array.splice(row-1, 1);
    removeStudentFromDatabase(row);
    updateData();
}

function removeStudentFromDatabase(row) {
    //181, 215, 221
    var id = student_array[row - 1];
    console.log(id.id);
    $.ajax({
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        data: {
            api_key: API_KEY,
            student_id: id
        },
        success: function(result) {
            get_data_from_server();
        },
        error: function(err) {
            console.log(err);
        }
    })

}


function get_data_from_server(){
    console.log('click initiated');
    $.ajax({
        data: {'api_key': '8KyFdlyzfV' },
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: "POST",
        success: function(result) {
            console.log('AJAX Success function called, with the following result:\n', result);
            /*console.log(student_array);*/
            student_array = result.data;
            updateData();
        },
        error: function () {
            console.log('error');
        }
    });
    console.log('End of click function');
}

function renumberIdentification() {
    for (var i = 0; i < student_array.length; i++) {
        student_array[i].id = i + 1;
    }
}
