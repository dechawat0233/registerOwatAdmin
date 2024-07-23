import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { useHistory } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function Admin() {
  const { userId } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedstatus, setSelectedstatus] = useState("");
  const [data, setData] = useState([]);

  const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState([]);

  const navigate = useNavigate();

  const tableHead = {
    borderRight: "3px solid",
    borderColor: "#fff",
    backgroundColor: "#EF4923",
    height: "2.5rem",
    padding: "4px",
    alignContent: "center",
    marginBottom: "2px",
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3200/applications");
        setData(response.data);
        // console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setAllUser(response.data);
        // console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  console.log("allUser", allUser);

  const handleStatusChang = async (e, _id) => {
    const newStatus = e.target.value;
    setSelectedstatus(newStatus);
    try {
      setData((prevData) =>
        prevData.map((row) =>
          row._id === _id ? { ...row, status: newStatus } : row
        )
      );
      await axios.put(`http://localhost:3200/applications/${_id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDateChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setSelectedDate(selectedOption.value);
    } else {
      setSelectedDate(null);
    }
  };

  const handleDetail = (row) => {
    // ! กลับมาเปลี่ยน url ด้วยถ้าหลังบ้านเสร็จ `/details/${row.id}`
    navigate(`/page-one/${row._id}`);
    console.log("ดูรายละเอียดของ:", row);
  };

  const handleContract = (id) => {
    console.log("ดูใบสัญญาของแถวที่:", id);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ผ่าน":
        return "#009028";
      case "รอดำเนินการ":
        return "#DC9E00";
      case "ไม่ผ่าน":
        return "#B80000";
      default:
        return "inherit";
    }
  };
  console.log(data);

  const loadOptions = async (inputValue) => {
    try {
      const response = await axios.get("http://localhost:3200/applications");
      const Data = response.data;
      const filteredOptions = Data.filter((row) =>
        row.date.includes(inputValue)
      ).map((row) => ({
        value: row.date,
        label: formatDate(row.date),
      }));
      console.log(filteredOptions);
      return filteredOptions;
    } catch (error) {
      console.error("Error fetching options:", error);
      return [];
    }
  };

  const handleDetailClick = (userId) => {
    console.log("Navigating to user ID:", userId);
    navigate(`/detail/${userId}`);
  };

  const fetchUserData = async (userId) => {
    console.log("test", userId);
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data); // Set the fetched user data
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  console.log("user", user);

  const generatePdf = (userId) => {
    fetchUserData(userId);
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    // Set the font and size
    // doc.setFont("helvetica", "bold");

    const fontPath = "/assets/fonts/THSarabunNew.ttf";

    doc.addFileToVFS(fontPath);
    doc.addFont(fontPath, "THSarabunNew", "normal");
    doc.setFont("THSarabunNew"); // Set the font
    doc.setFontSize(20);
    const OwatIcon = "/assets/images/OwatIcon.png";
    const OwatSupport = "/assets/images/supportIcon.png";
    doc.addImage(OwatIcon, "PNG", 10, 10, 60, 19);
    // doc.addImage(OwatSupport, "PNG", 145, 20, 60, 12.6);

    const imageUrl = `http://localhost:3000/${user.image}`;
    doc.addImage(imageUrl, "JPEG", 175, 38, 20, 27);
    // รูปสมัครงาน
    doc.setLineWidth(0.5);

    doc.rect(155, 35, 50, 30); // Draw the square

    // Draw the table structure
    const startX = 10; // X-coordinate of the top-left corner of the table
    const startY = 45; // Y-coordinate of the top-left corner of the table
    const cellWidth = 30; // Width of each cell
    const cellHeight = 10; // Height of each cell

    // Draw the horizontal lines
    for (let i = 0; i <= 2; i++) {
      doc.line(
        startX,
        startY + i * cellHeight,
        startX + 3 * cellWidth,
        startY + i * cellHeight
      );
    }

    // Draw the vertical lines
    for (let i = 0; i <= 3; i++) {
      doc.line(
        startX + i * cellWidth,
        startY,
        startX + i * cellWidth,
        startY + 2 * cellHeight
      );
    }

    // Add text to the cells
    doc.setFontSize(15);
    const cellPadding = 2; // Padding within the cell
    doc.text(
      "วันเริ่มงาน",
      startX + cellPadding,
      startY + cellHeight - cellPadding
    );
    doc.text(
      "ตำแหน่ง",
      startX + cellWidth + cellPadding,
      startY + cellHeight - cellPadding
    );
    doc.text(
      "หน่วยงาน",
      startX + cellWidth * 2 + cellPadding,
      startY + cellHeight - cellPadding
    );

    // การมาสมัครงานทราบข่าวจาก
    // const rectX = 65;
    // const rectY = 195;
    // const rectWidth = 50;
    // const rectHeight = 30;
    // const text = "การมาสมัครงานทราบข่าวจาก";
    // doc.setFontSize(12);
    // const textWidth = doc.getTextWidth(text);
    // const textX = rectX + (rectWidth - textWidth) / 2;
    // const textY = rectY + rectHeight / 2 + 4; // 4 is an adjustment to center the text vertically
    // doc.setFillColor(255, 255, 0); // Yellow color

    const rectX = 10; // X-coordinate of the rectangle
    const rectY = 65; // Y-coordinate of the rectangle
    const rectWidth = 195; // Width of the rectangle
    const rectHeight = 7; // Height of the rectangle
    const text = "การมาสมัครงานทราบข่าวจาก";

    doc.setFillColor(255, 255, 0); // Yellow color
    doc.rect(rectX, rectY, rectWidth, rectHeight, "F"); // "F" for fill

    doc.setFontSize(12);
    const textWidth = doc.getTextWidth(text);
    const textX = rectX + (rectWidth - textWidth) / 2;
    const textY = rectY + rectHeight / 2 + doc.getFontSize() / 2 - 1; // Adjusting Y to center the text vertically
    doc.rect(10, 65, 195, 7, "FD");
    doc.rect(10, 72, 195, 7 * 3); //
    doc.text(text, textX, textY - 3);

    for (let i = 0; i <= 24; i++) {
      if (i == 1 || i == 15 || i == 22) {
        doc.setFillColor(255, 255, 0); // Yellow color

        doc.rect(10, 93 + 7 * i, 195, 7, "FD");
      } else {
        doc.rect(10, 93 + 7 * i, 195, 7);
      }
    }

    // Display 'choose' array items horizontally with mappings
    const chooseMappings = {
      "by a friend": "เพื่อน",
      leaflet: "ใบปลิว",
      "Office sign": "ป้ายหน้าออฟฟิต",
      "by staff": "เจ้าหน้าที่แนะนำ",
    };

    if (user.choose && Array.isArray(user.choose)) {
      // doc.text("Choose:", 10, 70);
      let xOffset = 12;
      const yOffset = 76; // Adjust the y position if needed

      user.choose.forEach((item, index) => {
        const mappedText = chooseMappings[item] || item; // Use mapping if available, otherwise use original
        const textWidth = doc.getTextWidth(mappedText);
        doc.text(mappedText, xOffset, yOffset);
        xOffset += textWidth + 5; // Adjust the space between items

        // Add slash after each item except the last one
        if (index < user.choose.length - 1) {
          const slashWidth = doc.getTextWidth(" / ");
          doc.text("/", xOffset, yOffset);
          xOffset += slashWidth - 1; // Adjust spacing for the slash
        }
      });
    }

    doc.text(`ชื่อ: ${user.name} ผู้ที่แนะนำมาสมัคร`, 12, 84);
    doc.text(`หน่วยงาน: ${user.agency}`, 90, 84);

    doc.text(`เบอร์โทรศัพท์: ${user.phone}`, 12, 92);
    doc.text(
      `เลขที่หลังบัตรประชาชนผู้สมัคร: ${user.idNumber} (เพื่อใช้ยื่นแสดงรายได้ประจำปี)`,
      90,
      92
    );

    if (user.social_security == "haveSocial_Security") {
      doc.text(
        `มีบัตรประกันสังคม โรงพยาบาล: ${user.social_security_number}`,
        12,
        98
      );
    }

    // รายละเอียดส่วนตัว
    const textPersonalDetails = "รายละเอียดส่วนตัว";
    const textPersonalDetailsWidth = doc.getTextWidth(textPersonalDetails);
    const textPersonalDetailsX =
      rectX + (rectWidth - textPersonalDetailsWidth) / 2;
    const textPersonalDetailsY =
      100 + rectHeight / 2 + doc.getFontSize() / 2 - 1; // Adjusting Y to center the text vertically

    doc.text(
      textPersonalDetails,
      textPersonalDetailsX,
      textPersonalDetailsY - 3
    );

    doc.text(`ชื่อ: ${user.names}`, 12, 112);

    doc.text(`สัญชาติ: ${user.nationality}`, 12, 118);
    doc.text(`เชื้อชาติ: ${user.ethnicity}`, 50, 118);
    doc.text(`ศาสนา: ${user.religion}`, 100, 118);

    doc.text(`เกิดวันที่: ${formatDate(user.birthdate)}`, 12, 126);
    doc.text(`อายุ: ${user.age} ปี`, 70, 126);

    doc.text(`สถานที่เกิด: ${user.place_of_birth}`, 12, 133);

    doc.text(`ที่อยู่(ตามบัตรประชาชน) เลขที่: ${user.addressForNumberID.addressNumber}`, 12, 140);
    doc.text(`หมู่ที่: ${user.addressForNumberID.addressVillage}`, 80, 140);
    doc.text(`ตรอกซอย: ${user.addressForNumberID.addressAlley}`, 120, 140);
    doc.text(`ถนน: ${user.addressForNumberID.addressRoad}`, 160, 140);

    doc.text(`ตำบล/แขวง: ${user.addressForNumberID.addressSubdistrict}`, 12, 147);
    doc.text(`อำเภอ/เขต: ${user.addressForNumberID.addressDistrict}`, 80, 147);

    doc.text(`จังหวัด: ${user.addressForNumberID.addressProvince}`, 12, 154);
    doc.text(`รหัสไปรณีย์: ${user.addressForNumberID.addressPostalNumber}`, 80, 154);
    doc.text(`โทรศัพท์: ${user.addressForNumberID.phones}`, 120, 154);

    doc.text(`บัตรประชาชนเลขที่: ${user.cardnumber}`, 12, 161);
    doc.text(`ออกให้ ญ ที่ว่าการเขต: ${user.country}`, 80, 161);
    doc.text(`จังหวัด: ${user.addressForNumberID.addressProvince}`, 120, 161);

    // const addressMappings = {
    //   "เป็นเจ้าของ": "myself",
    //   "อยู่กับพ่อแม่": "living with parents",
    //   "อยู่กับญาติ": "living with relatives",
    //   "บ้านเช่า": "house for rent",
    //   "หอพัก": "dormitory",
    // };

    const addressMappings = {
      "myself": "เป็นเจ้าของ",
      "living with parents": "อยู่กับพ่อแม่",
      "living with relatives": "อยู่กับญาติ",
      "house for rent": "บ้านเช่า",
      "หอพัก": "dormitory",
    };
    if (user.address) {
      // Parse the JSON string into an array
      const addressArray = JSON.parse(user.address);

      // Map each value using the addressMappings object
      const mappedAddresses = addressArray.map(item => addressMappings[item] || item);

      // Join the mapped values into a single string
      const addressString = mappedAddresses.join(" / ");

      // Add the text to the PDF
      doc.text(`ที่อยู่ปัจจุบัน(ที่สามารถติดต่อได้): ${addressString}`, 12, 168);
    }

    doc.text(`เลขที่: ${user.addressForContact.addressContactNumber}`, 12, 175);
    doc.text(`หมู่ที่: ${user.addressForContact.addressContactVillage}`, 80, 175);
    doc.text(`ตรอกซอย: ${user.addressForContact.addressContactAlley}`, 120, 175);
    doc.text(`ถนน: ${user.addressForContact.addressContactRoad}`, 160, 175);

    doc.text(`ตำบล/แขวง: ${user.addressForContact.addressContactSubdistrict}`, 12, 182);
    doc.text(`อำเภอ/เขต: ${user.addressForContact.addressContactDistrict}`, 80, 182);
    doc.text(`จังหวัด: ${user.addressForContact.addressContactProvince}`, 120, 182);

    doc.text(`รหัสไปรณีย์: ${user.addressForContact.addressContactPostalNumber}`, 12, 189);
    doc.text(`โทรศัพท์บ้านพัก: ${user.HomePhone || ""}`, 80, 189);

    doc.text(`โทรศัพท์มือถือ: ${user.phones || ""}`, 12, 196);
    doc.text(`โทรศัพท์ที่โทรติดต่อได้: ${user.HomePhone || ""}`, 80, 196);



    // สถานะครอบครัว
    const textfamilyStatus = "สถานะครอบครัว";
    const textfamilyStatusWidth = doc.getTextWidth(textfamilyStatus);
    const textfamilyStatusX =
      rectX + (rectWidth - textfamilyStatusWidth) / 2;
    const textfamilyStatusY =
      196 + rectHeight / 2 + doc.getFontSize() / 2 - 1; // Adjusting Y to center the text vertically

    doc.text(
      textPersonalDetails,
      textfamilyStatusX,
      textfamilyStatusY - 2
    );

    const familyStatusMappings = {
      single: "โสด",
      engaged: "หมั้น",
      married: "สมรสแล้ว",
      divorced: "หย่าร้าง",
      widowed: "หม้าย",
      separated: "แยกกันอยู่",
    };

    const userfamilyStatus = familyStatusMappings[user.familyStatus] || user.familyStatus;

    doc.text(`สถานะ: ${userfamilyStatus || ""}`, 12, 210);

    doc.text(`ชื่อ-นามสกุล คู่สมรส: ${user.spouseName || ""}`, 12, 217);
    doc.text(`สัญชาติ: ${user.spouseNationality || ""}`, 80, 217);

    doc.text(`อาชีพ: ${user.spouseJob || ""}`, 12, 224);
    doc.text(`สถานที่ทำงาน: ${user.spouseWorkplace || ""}`, 80, 224);

    doc.text(`โทรศัพท์: ${user.spouseMobile || ""}`, 12, 231);
    doc.text(`โทรศัพท์มือถือ: ${user.spousePhone || ""}`, 80, 231);
    const marriageRegistrationMappings = {
      registered: "มี",
      notRegistered: "ไม่มี",
    };
    const usermarriageRegistration = marriageRegistrationMappings[user.marriageRegistration] || user.marriageRegistration;
    doc.text(`ทะเบียนสมรส: ${usermarriageRegistration || ""}`, 120, 231);

    doc.text(`จำนวนบุตร: ${user.numChildren || ""} คน`, 12, 238);
    doc.text(`กำลังศึกษา: ${user.numChildrenStudying || ""} คน`, 80, 238);

    doc.text(`บุตรที่อายุตาำกว่า 6 ปี มีจำนวน: ${user.numChildrenUnder6 || ""} คน`, 12, 245);

    const uniqueIds = new Set();
    const uniqueEmployees = user.employees.filter(employee => {
      if (!uniqueIds.has(employee.id)) {
        uniqueIds.add(employee.id);
        return true;
      }
      return false;
    });

    let yOffset = 245; // Starting Y position
    let xOffset = 80;
    doc.text(`เกิด:`, xOffset, yOffset);
    uniqueEmployees.forEach(employee => {
      doc.text(`${employee.name} ||`, xOffset + 5, yOffset);
      xOffset += 17; // Adjust the Y position for the next text
    });


    // บิดา-มารดา
    const textFaNMa = "บิดา-มารดา";
    const textFaNMaWidth = doc.getTextWidth(textFaNMa);
    const textFaNMaX =
      rectX + (rectWidth - textFaNMaWidth) / 2;
    const textFaNMaY =
      245 + rectHeight / 2 + doc.getFontSize() / 2 - 1; // Adjusting Y to center the text vertically

    doc.text(
      textPersonalDetails,
      textFaNMaX,
      textFaNMaY - 2
    );

    doc.text(`บิดา: ${user.fatherName || ""}`, 12, 259);
    doc.text(`อายุ: ${user.fatherAge || ""}ปี`, 80, 259);
    doc.text(`อาชีพ: ${user.fatherJob || ""}`, 120, 259);

    doc.text(`มารดา: ${user.motherName || ""}`, 12, 266);
    doc.text(`อายุ: ${user.motherAge || ""} ปี`, 80, 266);
    doc.text(`อาชีพ: ${user.motherJob || ""}`, 120, 266);

    doc.text(`หมายเหตุ: 1.ข้อมูลส่วนตัวของผู้สมัครทางบริษัทฯ ไม่ได้นำมาประกอบพิจารณฯาในการคัดเลือกผู้สมัครเพื่อรับเข้าทำงานแต่เป็นข้อมูลแนบประวัติพนักงานเท่านั้น`, 12, 273);

    doc.text(`              2.เอกสารฉบับนี้ได้รับการคุ้มครองตาม พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562`, 12, 280);


    doc.addPage();
    // ประวัติการศึกษา
    for (let i = 0; i <= 3; i++) {
      if (i == 0) {
        doc.setFillColor(255, 255, 100); // Yellow color

        doc.rect(10 + 48.75 * i, 17, 48.75, 7 * 6, "FD");
      } else {
        // doc.rect(10 + 48.75 * i, 17, 48.75, 7 * 6);
      }
    }

    for (let i = 0; i <= 6; i++) {
      if (i == 1) {
        doc.setFillColor(255, 255, 0); // Yellow color

        doc.rect(10, 10 + 7 * i, 195, 7, "FD");
      } else {
        doc.rect(10, 10 + 7 * i, 195, 7);
      }
    }

    for (let i = 0; i <= 3; i++) {
        doc.rect(10 + 48.75 * i, 17, 48.75, 7 * 6);
    }

    

    const texteducationData = "ประวัติการศึกษา";
    const texteducationDataWidth = doc.getTextWidth(texteducationData);
    const texteducationDataX =
      rectX + (rectWidth - texteducationDataWidth) / 2;
    const texteducationDataY =
      7 + rectHeight / 2 + doc.getFontSize() / 2 - 1; // Adjusting Y to center the text vertically

    doc.text(
      texteducationData,
      texteducationDataX,
      texteducationDataY - 1
    );

const textEducationData = [
      "วุฒิการศึกษา",
      "ชื่อสถานศึกษา",
      "ที่ตั้ง",
      "ระยะเวลาที่ศึกษา(พ.ศ.) ตั้งแต่เริ่ม จนจบ"
    ];
  
    let y = 22; // Starting Y position for the text
    const xStart = 10; // Starting X position for the rectangles
  
    textEducationData.forEach((text, index) => {
      const textWidth = doc.getTextWidth(text);
      const x = xStart + 48.75 * index + (48.75 - textWidth) / 2;
      doc.text(text, x, y);
    });

    const textEducationData2 = [
      "ประถมศึกษาปีที่ 1-6",
      "มัธยมศึกษาปีที่ 1-3 / ปวช.",
      "มัธยมศึกษาปีที่ 4-6 / ปวช.",
      "ป.ตรี",
      "อื่นๆ",
    ];
  
    textEducationData2.forEach((text, index) => {
      const textWidth = doc.getTextWidth(text);
      const x = xStart + (48.75 - textWidth) / 2; // Center text in the first column
      const yPosition = 18 + 7 * (index + 1) + 3.5; // Adjust y position for each row
      doc.text(text, x, yPosition);
    });


    doc.text(`หมายเหตุ: 1.ข้อมูลส่วนตัวของผู้สมัครทางบริษัทฯ ไม่ได้นำมาประกอบพิจารณฯาในการคัดเลือกผู้สมัครเพื่อรับเข้าทำงานแต่เป็นข้อมูลแนบประวัติพนักงานเท่านั้น`, 12, 273);

    doc.text(`              2.เอกสารฉบับนี้ได้รับการคุ้มครองตาม พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562`, 12, 280);



    // doc.text(`เกิด: ${user.numChildrenStudying || ""} คน`, xOffset, 245);
    // doc.text(`อาศัยกับ: ${user.address}`, 12, 147);

    // doc.text(`โทรศัพท์มือถือ: ${user.phones}`, 12, 147);
    // doc.text(`โทรศัพท์ที่สามารถติดต่อได้: ${user.contactPhone}`, 12, 147);



    // Add the user's details to the PDF
    // doc.text("User Details", 10, 10);
    // doc.setFontSize(12);
    // doc.text(`Name: ${user.names}`, 10, 30);
    // doc.text(`Position: ${user.position}`, 10, 40);
    // doc.text(`Status: ${user.status}`, 10, 50);
    // Add more user details as needed

    // Save the PDF
    // doc.save(`${user.names}-details.pdf`);
    const pdfContent = doc.output("bloburl");
    window.open(pdfContent, "_blank");
  };

  return (
    <div style={{ height: "100vh" }}>
      <h1 style={{ textShadow: "2px 2px 4px #BFBFBF", color: "#EF4923" }}>
        รายชื่อผู้สมัครงาน
      </h1>
      <div>
        <table>
          <thead>
            <tr>
              <th style={tableHead}>
                <p>ชื่อ - นามสกุล ผู้สมัคร</p>
              </th>
              <th style={tableHead}>
                <p>ตำแหน่งงานที่สมัคร</p>
              </th>
              <th style={tableHead}>
                <p>รายละเอียดเพิ่มเติม</p>
              </th>
              <th style={tableHead}>
                <p>สถานะ</p>
              </th>
              <th style={tableHead}>
                <p>ใบสัญญา</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {allUser.map((user, index) => (
              <tr key={index}>
                <td>{user.names}</td>
                <td>{user.position}</td>
                {/* <td><button value={user._id}>เพิ่มเติม</button></td> */}
                <td>
                  <button onClick={() => handleDetailClick(user._id)}>
                    เพิ่มเติม
                  </button>
                </td>
                <td>{user.status}</td>
                <td>
                  {/* <button>ออกใบ</button> */}
                  <button onClick={() => generatePdf(user._id)}>ออกใบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
