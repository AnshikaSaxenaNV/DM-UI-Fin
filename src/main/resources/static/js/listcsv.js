
// Downalod functionality
$(document).ready(function () {
    $('#entity').change(function () {
        var selectedFileName = $(this).children("option:selected").val();
        var loc = "http://localhost:8080/api/download";
        var temp = "Download Entity Lookup Sample File";
        // document.getElementById("download").setAttribute("href", loc + "/" + selectedFileName);
        $.ajax({
            url: '/api/download/' + selectedFileName,
            type: 'GET',
            data: selectedFileName,
            success: function (returndata) {
                console.log(selectedFileName);

                $('select option[value="1"]').attr("selected", true);
                setInterval('location.reload()', 100);
            }
        })
    });
});


//select admin primary entity
$(document).ready(function () {
    $('#entitylist').change(function () {
        var selectedFileName = $(this).children("option:selected").val();
        $.ajax({
            url: '/api/add',
            type: 'POST',
            data: selectedFileName,
            success: function (returndata) {
                console.log(selectedFileName);
                setInterval('location.reload()', 100);
            }
        })
    })
});
$(document).ready(function () {
    $('#setPrimary').fadeOut(5000);
});
//selecting validate entity
$(document).ready(function () {
    $('#entityValidate').change(function () {
        var selectedFileName = $(this).children("option:selected").val();
        $.ajax({
            url: '/api/validate',
            type: 'POST',
            data: selectedFileName,
            success: function (returndata) {
                console.log(selectedFileName);
                setInterval('location.reload()', 100);
            }
        })
    })
});
//select validate Secondary entity
// $(document).ready(function () {
//     $('#entityValidateS').change(function () {
//         var selectedFileName = $(this).children("option:selected").val();
//         $.ajax({
//             url : '/api/validate',
//             type : 'POST',
//             data : selectedFileName,
//             success : function(returndata) {
//             console.log(selectedFileName);
//             }
//         })
//     })
// });
$(document).ready(function () {
    $('#mybtn-para').fadeOut(5000);
});
//validate global lookup
function validateForm() {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "text") {
            var x = inputs[i].value;
            if (inputs[i].value == "" || inputs[0].value == "" || inputs[1].value == "" || inputs[2].value == "" || inputs[3].value == "") {
                //alert("Field should not be empty");
                swal({
                    //title: "Title",
                    text: "Field should not be empty",
                    timer: 3000,
                });
                // document.getElementById("issue").innerHTML = "Field should not be empty";
                return false;
            }
            else {
                return true;
            }
        }
    }
    //return true;
}
// $(document).ready(function () {
//     $('#add').click(function () {
//         var loc = document.getElementById("newdata");
//     loc.innerHTML = "<tr id='nw'><td><input type='text' id='1'/></td><td><input type='text' id='1'/></td></tr>";
//     });
// });
// deleteRow
function deleteRow(el, sform) {
    var selectedFileName = el.attributes.value.value;
    console.log(el);
    console.log(sform.id);
    console.log(selectedFileName);
    swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Your record has been deleted!", {
                    icon: "success",
                });
                var tbl = el.parentNode.parentNode.parentNode;
                var row = el.parentNode.parentNode.rowIndex;
                tbl.deleteRow(row);
                const formData = new FormData(sform);
                const formMap = new Map();
                for (var [key, value] of formData) {
                    formMap.set(key, value);
                }
                console.log(formMap);
                $.ajax({
                    url: '/api/writeSec/'+selectedFileName,
                    type: 'POST',
                    data: Object.fromEntries(formMap),
                    dataType: "json",
                    success: function (formMap) {
                        console.log(formMap);
                        //setInterval('location.reload()',100);
                        //window.location = '/admin';
                    }
                })
            } else {
                swal("Your record is safe!");
            }
        });
    return false;
}
//add row
function addRow(id, i) {
    var t = document.getElementById(id);
    var rows = t.getElementsByTagName("tr");
    var r = rows[rows.length - 1];
    r.parentNode.insertBefore(getTemplateRow(i), r);
}
function getTemplateRow(i) {
    var x = document.getElementById(i).cloneNode(true);
    x.childNodes[0].nextSibling.firstChild.value = "";
    x.childNodes[0].nextSibling.firstChild.name = i;
    x.childNodes[0].nextElementSibling.nextElementSibling.firstChild.value = "";
    x.childNodes[0].nextElementSibling.nextElementSibling.firstChild.name = i + "val";
    console.log(x.childNodes);
    return x;
}

// fetching primary
$(document).ready(function () {
    $('#fetchbtn').click(function () {
        var selectedFileName = $(this).val();
        // const validatebtn = document.getElementById("validateBtn");
        $.ajax({
            url: '/api/validate/upload',
            type: 'POST',
            data: { 'selectedValueValidate': selectedFileName },
            success: function (returndata) {
                console.log(selectedFileName);
                $("#validateBtn").prop("hidden", false);
                $("#validateImg").prop("hidden", false);
                $('#fetchP').html('<b>' + selectedFileName + '</b>' + " fetched successfully and ready to validate");
            },
            error:function(){
                $('#fetchP').html('<b>' + selectedFileName + '</b>' + " not Found !");
   
            }
        })
    });
});

//validate primary
$(document).ready(function () {
    $('#validateBtn').click(function () {
        var selectedFileName = $(this).val();
        // const validatebtn = document.getElementById("validateBtn");
        $.ajax({
            url: '/api/validate/primary',
            type: 'POST',
            data: { 'entityValidate': selectedFileName },
            success: function (message) {
                console.log(message);
                let keys = Object.keys(message);
                let vals =Object.values(message);
                
                console.log(vals+":"+keys);
                if(keys=="Error"){
                    console.log(keys+"="+"Error");

                $('#fetchP').html("");

                $("#validateImg").prop("hidden", true);

                document.getElementById("error").style.color = "red";

                $('#error').html('<b>' + vals + '</b>');

                $("#secondaryValidate").prop("disabled", true);
                }else{
                    $("#validateImg").prop("hidden", false);
                $('#fetchP').html('<b>' + selectedFileName + '</b>' + " validated successfully");
                $.ajax({
                    url: '/api/validateSelect',
                    type: 'GET',
                    data: { 'entityValidate': selectedFileName },
                    success: function (result) {
                        console.log(result);
                        $.each(result, function (key, value) {
                            $("#secondaryValidate").append('<option' + '>' + value + '</option>');
                            console.log(value);
                        });


                    }
                });

                $("#secondaryValidate").prop("disabled", false);
                document.getElementById("secondaryValidate").style.color = "#0D71AC";
                document.getElementById("secondaryProcessMessage").style.color = "black";
                }
                //call secondary

                // $.ajax({
                //     url: '/api/validateSelect',
                //     type: 'GET',
                //     data: { 'entityValidate': selectedFileName },
                //     success: function (result) {
                //         console.log(result);
                //         $.each(result, function (key, value) {
                //             $("#secondaryValidate").append('<option' + '>' + value + '</option>');
                //             console.log(value);
                //         });


                //     }
                // })

                //end call secondary
                $.ajax({
                    url: '/api/validate/messageprimary',
                    type: 'GET',
                    data: { 'entityValidate': selectedFileName },
                    success: function (result) {
                        console.log(result);
                        $.each(result, function (key, value) {
                            $('#messageOutput').html(value);
                            console.log(value);
                        });


                    }
                })

                $("#validateBtn").prop("hidden", true);
                //$("#validateImg").prop("hidden", false);

                document.getElementById("fetchP").style.color = "green";
                // $('#fetchP').html('<b>' + selectedFileName + '</b>' + " validated successfully");
                // $("#secondaryValidate").prop("disabled", false);
                // document.getElementById("secondaryValidate").style.color = "#0D71AC";
                // document.getElementById("secondaryProcessMessage").style.color = "black";

            }
        })
    });
});

//Transform
$(document).ready(function () {
    $('#transformBtn').click(function () {
        var selectedFileName = $(this).val();
        console.log(selectedFileName);
        // const validatebtn = document.getElementById("validateBtn");
        $.ajax({
            url: '/api/transforming',
            type: 'POST',
            data: { 'entityTransform': selectedFileName },
            success: function (returndata) {
                console.log(selectedFileName);
                $("#transformBtn").prop("hidden", true);
                // document.getElementById("transformBtn").style.visibility = "hidden";
                // $("#transformMessage").prop("hidden", true);
                document.getElementById("transformMessage").style.visibility = "hidden";
                // $('#fetchP').html('<b>'+selectedFileName+'</b>'+" fetched successfully and ready to validate");
                $("#myProgress").prop("hidden", false);

                move();
            }
        })
    });
});

//Select button for secondary entity list selection
$(document).ready(function () {
    $('#secondaryValidate').change(function () {
        var selectedFileName = $(this).children("option:selected").val();
        var selectFolderName = document.getElementById("validateBtn").value;
        console.log(selectFolderName);
        $.ajax({
            url: '/api/validate/secondary',
            type: 'POST',
            data: { 'entityValidate': selectedFileName, 'primaryEntityValidate': selectFolderName },
            success: function (returndata) {
                console.log(selectedFileName);
                $('#secondaryFetchImg').prop("hidden", false);
                document.getElementById("fetchS").style.color = "black";
                $('#fetchS').html('<b>' + selectedFileName + '</b>' + " fetched successfully and ready to validate");
                $('#secondaryValidateBtn').prop("hidden", false);
            }
        })
    });
});

//validate secondary
$(document).ready(function () {
    $('#secondaryValidateBtn').click(function () {
        var selectedFileName = document.getElementById("secondaryValidate").value;
        var selectFolderName = document.getElementById("validateBtn").value;
        // const validatebtn = document.getElementById("validateBtn");
        $.ajax({
            url: '/api/validate/validateSecondary',
            type: 'POST',
            data: { 'entityValidate': selectedFileName, 'primaryEntityValidate': selectFolderName },
            success: function (message) {
                console.log(message);
                document.getElementById("fetchS").style.color = "green";
                $('#fetchS').html('<b>' + selectedFileName + '</b>' + " processed and validated successfully");
                $('#secondaryValidateBtn').prop("hidden", true);
            }
        })
    });
});

// Function for progress bar

function move() {
    var i = 0;
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        console.log(elem);
        var width = 1;
        var id = setInterval(frame, 10);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
                elem.innerHTML = width + "%";
                if (width == 100) {

                    $('#transformMessage').html("Completed!");
                    document.getElementById("transformMessage").style.visibility = "visible";
                    $('#transformComplete').html(" Transformation completed successfully");
                    $('#transformDone').prop("hidden", false);

                }
                else {
                    $('#transformComplete').html(" Transforming...");
                }
            }
        }
    }


}

//bg colour chooser for cards
$(document).ready(function () {
    var index = 0;
    $(".small_circle").each(function (item) {
        var colors = ["#D8C595 ", "#3E64B8", "#56BDC5", "#656464", "#6EC3E1", "#2D6664", "#F0823D", "#2B8CC6"];
        var colorsLength = colors.length;
        var colorIndex = index % colorsLength;
        $(this).css("background-color", colors[colorIndex]);
        index++;
    });
});

// Global Lookup Popup Script
function openForm() {
    document.getElementById("popupForm").style.display = "block";
}
function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}

//For Secondary Lookup submit
$(document).ready(function () {
    
    $('#submitSec').click(function () {
        var selectedFileName = $(this).val();
    console.log(selectedFileName);
        // const validatebtn = document.getElementById("validateBtn");
        //var formsCollection = document.getElementsByTagName("form");
       
        var f=[]
        const formm = new Map();
        var dataModel ={};
        for (var i = 0; i < document.forms.length; i++) {
            var foo =document.forms[i];
            var fd = new FormData(foo);
            console.log(fd);
            const formMap = new Map();
            for(var [key,value] of fd){

                formMap.set(key,value);
                
            }
            console.log(formMap);
             $.ajax({
            url: '/api/writeSec/'+selectedFileName,
            type: 'POST',
            dataType:"json",
            //contentType: "application/json",
            data:Object.fromEntries(formMap),
            success: function (message) {
                console.log(message);
            }
        })
          
           
        }
       
        
    });
});
