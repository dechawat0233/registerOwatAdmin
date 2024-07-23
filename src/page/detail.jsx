import React, { useEffect, useState } from "react";
import axios from "axios";
import Bar from "../component/bar";
import { useNavigate, useParams } from "react-router-dom";

/*
TODO แต่ละอันมีรายละเอียดอีก หลังบ้านยังไม่ทำ 
TODO สองหน้นี้แค่เก็ตข้อมูลลมาดูเฉยๆ
*/

export default function Detail() {
  return (
    <div style={{ display: "flex" }}>
      <Bar />
      <PageOne />
    </div>
  );
}


function PageOne({ allUsers, setAllUsers }) {
  const { userId } = useParams();
  const [user, setUser] = useState([]);

  const chooseMappings = {
    "by a friend": "เพื่อน",
    leaflet: "ใบปลิว",
    "Office sign": "ป้ายหน้าออฟฟิต",
    "by staff": "เจ้าหน้าที่แนะนำ",
  };

  const familyStatusMappings = {
    single: "โสด",
    engaged: "หมั้น",
    married: "สมรสแล้ว",
    divorced: "หย่าร้าง",
    widowed: "หม้าย",
    separated: "แยกกันอยู่",
  };

  const childStatusMappings = {
    notChild: "ไม่มีบุตร",
    haveChild: "มีบุตร",
  };

  const marriageRegistrationMappings = {
    registered: "มี",
    notRegistered: "ไม่มี",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const [data, setData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3200/applications/${id}`
  //       ); // Replace '123' with the actual _id
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  console.log("allUsers", allUsers);
  console.log("user", user);


  const handleDetailClick = (userId) => {
    console.log('Navigating to user ID:', userId);
    navigate(`/page-two/${userId}`);
  };




  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <div
        style={{
          display: "flex",
          textAlign: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "28px", margin: "2rem 0" }}>ใบรับสมัครพนักงาน</p>
      </div>
      {/* ! อย่าลืมมาใส่หลังบ้าน 
            ex. <p>ใบรับสมัครพนักงาน: {data.employeeApplication}</p>
            <p>วันที่เริ่มงาน: {data.startDate}</p>
            */}
      <div style={{ margin: "0 3rem" }}>
        <div class="row">
          <p>
            <strong>วันที่เริ่มงาน</strong> {user.startDate}
          </p>
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-4">
                  <p style={{}}>
                    <strong>ตำแหน่ง</strong> {user.position}
                  </p>
                </div>

                <div class="col-md-4">
                  <p style={{}}>
                    <strong>หน่วยงาน</strong> {user.agency}
                  </p>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "20vh",
                  right: "11vw",
                  width: "10rem",
                  height: "13rem",
                }}
              >
                {/* {user.image && (
                  <img
                    src={`http://localhost:3000/uploads/${user.image}`}
                    alt={user.image}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )} */}

                {user.image && (
                  <img
                    src={`http://localhost:3000/${user.image}`}
                    alt={user.image}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}

                {/* <img
                  src={`http://localhost:3000/uploads/${user.image}`}
                  alt={user.image}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}  */}

                {/* {user.image} */}
              </div>
            </div>
          </div>
        </div>

        {user.choose && user.choose.length > 0 ? (
          <div>
            <strong>ทราบข่าวการสมัครงาน จาก </strong>{" "}
            {user.choose.map((choice, index) => (
              <div key={index}>- {chooseMappings[choice] || choice}</div>
            ))}
            <p>
              <strong>ชื่อ ผู้ที่แนะนำมาสมัคร:</strong> {user.name}{" "}
              <strong>เบอร์โทรศัพท์ :</strong> {user.phone}{" "}
              <strong>เลขที่หลังบัตรประชาชนผู้สมัคร :</strong> {user.idNumber}
            </p>
          </div>
        ) : (
          <div></div>
        )}

        {/* {data.referrer && (
          <div style={{ margin: "2rem 0" }}>
            <p>
              <strong>ทราบข่าวการสมัครงาน จาก </strong>{" "}
              {user.referrer.ref_depertment}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                columnGap: "20px",
                rowGap: "10px",
              }}
            >
              <p>ชื่อ ผู้ที่แนะนำมาสมัคร {data.referrer.ref_name}</p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                columnGap: "20px",
                rowGap: "10px",
              }}
            >
              <p style={{}}>เบอร์โทรศัพท์ {data.referrer.ref_phone}</p>
              <p style={{ width: "25rem", paddingLeft: "1.7rem" }}>
                เลขที่หลังบัตรประชาชนผู้สมัคร {data.id_card_number_back}
              </p>
            </div>
          </div>
        )} */}

        {user.social_security == "haveSocial_Security" ? (
          <div>
            <strong>บัตรประกันสังคม </strong> <strong>โรงพยาบาล :</strong>{" "}
            {user.social_security_number} <p></p>
          </div>
        ) : (
          <div>
            <strong>ไม่มีบัตรประกันสังคม </strong>{" "}
          </div>
        )}

        {/* {data.social_security ? (
          <div style={{ margin: "2rem 0" }}>
            <p>
              <strong>บัตรประกันสังคม</strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                columnGap: "20px",
                rowGap: "10px",
              }}
            >
              <p>มี บัตรประกันสังคม</p>
              <p>โรงพยาบาล {data.social_security.social_security_hospital}</p>
            </div>
          </div>
        ) : (
          <p>ไม่มี บัตรประกันสังคม</p>
        )} */}

        <div style={{ margin: "2rem 0" }}>
          <p>
            <strong>รายละเอียดส่วนตัว</strong>
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              columnGap: "20px",
              rowGap: "10px",
            }}
          >
            <p>ชื่อ: {user.names}</p>
            <p>สัญชาติ: {user.nationality}</p>
            <p>เชื้อชาติ: {user.ethnicity}</p>
            <p>ศาสนา: {user.religion}</p>
            <p>เกิดวันที่ {formatDate(user.birthdate)}</p>
            <p>อายุ: {user.age}</p> <p>สถานที่เกิด: {user.place_of_birth}</p>
          </div>
        </div>

        {user.addressForNumberID && (
          <div style={{ margin: "2rem 0" }}>
            <p>
              <strong>ที่อยู่ตามบัตรประชาชน</strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                columnGap: "20px",
                rowGap: "10px",
              }}
            >
              <p>เลขที่ {user.addressForNumberID.addressNumber}</p>
              <p>หมู่ที่ {user.addressForNumberID.addressVillage}</p>
              <p>ตรอก/ซอย {user.addressForNumberID.addressAlley}</p>
              <p>ถนน {user.addressForNumberID.addressRoad}</p>
              <p>
                ตำบล/แขวง {user.addressForNumberID.addressSubdistrict}
              </p>
              <p>อำเภอ {user.addressForNumberID.addressDistrict}</p>
              <p>จังหวัด {user.addressForNumberID.addressProvince}</p>
              <p>
                รหัสไปรษณีย์ {user.addressForNumberID.addressPostalNumber}
              </p>
              {/* <p>โทรศัพท์ {data.contact_detail.phone}</p>
              <p>บัตรประชาชนเลขที่ {data.id_card_number}</p>{" "}
              <p>ออก ณ ที่ว่าการเขต {data.id_card_issus_place}</p>{" "}
              <p>จังหวัด {data.id_card_province}</p> */}
            </div>
          </div>
        )}

        {user.addressForContact && (
          <div style={{ margin: "2rem 0" }}>
            <p>
              <strong>ที่อยู่ปัจจุบันที่สามารถติดต่อได้</strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                columnGap: "20px",
                rowGap: "10px",
              }}
            >
              <p>เลขที่ {user.addressForContact.addressContactNumber}</p>
              <p>หมู่ที่ {user.addressForContact.addressContactVillage}</p>
              <p>ตรอก/ซอย {user.addressForContact.addressContactAlley}</p>
              <p>ถนน {user.addressForContact.addressContactRoad}</p>
              <p>
                ตำบล/แขวง {user.addressForContact.addressContactSubdistrict}
              </p>
              <p>อำเภอ {user.addressForContact.addressContactDistrict}</p>
              <p>จังหวัด {user.addressForContact.addressContactProvince}</p>
              <p>
                รหัสไปรษณีย์ {user.addressForContact.addressContactPostalNumber}
              </p>
              {/* <p>โทรศัพท์ {data.contact_detail.phone}</p>
              <p>บัตรประชาชนเลขที่ {data.id_card_number}</p>{" "}
              <p>ออก ณ ที่ว่าการเขต {data.id_card_issus_place}</p>{" "}
              <p>จังหวัด {data.id_card_province}</p> */}
            </div>
          </div>
        )}

        {/* {data.contact_detail && data.contact_detail.permanent_address && (
          <div style={{ margin: "2rem 0" }}>
            <p>
              <strong>ที่อยู่ปัจจุบันที่สามารถติดต่อได้</strong>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                columnGap: "20px",
                rowGap: "10px",
              }}
            >
              <p>{data.contact_detail.permanent_address.status}</p>{" "}
              <p>เลขที่ {data.contact_detail.permanent_address.address_line}</p>
              <p>หมู่ที่ {data.contact_detail.permanent_address.moo}</p>
              <p>ตรอก/ซอย {data.contact_detail.permanent_address.alley}</p>
              <p>ถนน {data.contact_detail.permanent_address.road}</p>
              <p>
                ตำบล/แขวง {data.contact_detail.permanent_address.sub_district}
              </p>
              <p>อำเภอ {data.contact_detail.permanent_address.district}</p>
              <p>จังหวัด {data.contact_detail.permanent_address.province}</p>
              <p>
                รหัสไปรษณีย์ {data.contact_detail.permanent_address.postal_code}
              </p>
              <p>โทรศัพท์มือถือ {data.contact_detail.mobile_phone}</p>
              <p>โทรศัพท์ที่สมารถติดต่อได้ {data.contact_detail.phone}</p>
            </div>
          </div>
        )} */}

        <p>
          {user.familyStatus == "divorced" || user.familyStatus == "engaged" ? (
            <div>
              <div>
                <strong>สถานะครอบครัว</strong> -{" "}
                {familyStatusMappings[user.familyStatus] || user.familyStatus}
              </div>

              <div>
                <p style={{ margin: "1rem 0" }}>
                  <strong>ทะเบียนสมรส- มีทะเบียนสมรส</strong>
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    columnGap: "20px",
                    rowGap: "10px",
                  }}
                >
                  {/* <p>ทะเบียนสมรส </p> */}
                  <p>ชื่อ {user.spouseName}</p>
                  <p>สัญชาติ {user.spouseNationality}</p>
                  <p>อาชีพ {user.spouseJob}</p>
                  <p>สถานที่ทำงาน {user.spouseWorkplace}</p>
                  <p>โทรศัพท์มือถือ {user.spouseMobile}</p>
                  <p>โทรศัพท์ที่ติดต่อได้ {user.spousePhone}</p>
                  <p>ทะเบียนสมรส {marriageRegistrationMappings[user.marriageRegistration] || user.marriageRegistration}
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    columnGap: "20px",
                    rowGap: "10px",
                    margin: "1rem 0",
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div>
              <strong>สถานะครอบครัว</strong> -{" "}
              {familyStatusMappings[user.familyStatus] || user.familyStatus}
            </div>
          )}
        </p>

        {user.child == "haveChild" ? (
          <div>
            <div>
              <strong>บุตร : </strong> -{" "}
              {childStatusMappings[user.child] || user.child}
            </div>
            <p>
              <strong>บุตร - มีบุตรจำนวน : </strong>
              {user.numChildren} คน
            </p>
            <p>
              <strong>กำลังศึกษา : </strong>
              {user.numChildrenStudying} คน
            </p>

            <div style={{ margin: "2rem 0" }}>
              <p>
                <strong>จำนวนบุตรอายุต่ำกว่า 6 ปี : </strong>
                {user.numChildrenUnder6} คน
              </p>
              <p>
                <strong>วันเดือนปีเกิดของบุตรที่อายุต่ำกว่า 6 ปี </strong>
              </p>
              {/* <ol style={{ margin: "0" }}>
                {user.employees.map((child, index) => (
                  <li key={index}>เกิดวันที่ {{name}}</li>
                ))}
              </ol> */}
              <ol style={{ margin: "0" }}>
                {user.employees.map((employee, index) => (
                  <li key={index}>เกิดวันที่ {employee.name}</li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div>
            <strong>ไม่มีบุตร</strong> -{" "}
            {childStatusMappings[user.child] || user.child}
          </div>
        )}
        {/* ! ถ้ามีสถานะจะมีข้อมูลตัวอื่นขึ้นมาด้วย */}
        {/* <FamilyStatus status={data.marital_status} data={data} /> */}

        <div>
          <p>
            <strong>บิดา - มารดาผู้สมัคร</strong>
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              columnGap: "20px",
              rowGap: "10px",
            }}
          >
            {user.fatherName ? (
              <>
                <p>ชื่อ บิดา {user.fatherName}</p>
                <p>อายุ {user.fatherAge}</p>
                <p>อาชีพ {user.fatherJob}</p>
              </>
            ) : (
              <p>ไม่มีข้อมูล</p>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              columnGap: "20px",
              rowGap: "10px",
            }}
          >
            {user.motherName ? (
              <>
                <p>ชื่อ มารดา {user.motherName}</p>
                <p>อายุ {user.motherAge}</p>
                <p>อาชีพ {user.motherJob}</p>
              </>
            ) : (
              <p>ไม่มีข้อมูล</p>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#EF4923",
            color: "#fff",
            border: "none",
            boxShadow: "none",
            width: "4rem",
            height: "2rem",
            margin: "0.5rem",
            cursor: "pointer",
          }}
        >
          ย้อนกลับ
        </button>
        <button
          // onClick={() => navigate(`/page-two/${userId}`)}
          onClick={() => handleDetailClick(user._id)}
          style={{
            backgroundColor: "#EF4923",
            color: "#fff",
            border: "none",
            boxShadow: "none",
            width: "4rem",
            height: "2rem",
            margin: "0.5rem",
            cursor: "pointer",
          }}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

function FamilyStatus({ status, data }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };
  return (
    <div>
      {status && (
        <div>
          {/* ! ตรวจสอบสถานะและแสดงข้อมูลเฉพาะเมื่อมีสถานะ */}
          {status === "แต่งงานแล้ว" && data && (
            <div>
              <p style={{ margin: "1rem 0" }}>
                <strong>ทะเบียนสมรส- มีทะเบียนสมรส</strong>
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  columnGap: "20px",
                  rowGap: "10px",
                }}
              >
                {/* <p>ทะเบียนสมรส </p> */}
                <p>ชื่อ {data.spouse_name}</p>
                <p>สัญชาติ {data.spouse_nationality}</p>
                <p>อาชีพ {data.spouse_occupation}</p>
                <p>สถานที่ทำงาน {data.spouse_workplace}</p>
                <p>โทรศัพท์มือถือ {data.spoue_mobilephone}</p>
                <p>โทรศัพท์ที่ติดต่อได้ {data.spouse_phone}</p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  columnGap: "20px",
                  rowGap: "10px",
                  margin: "1rem 0",
                }}
              >
                <p>
                  <strong>บุตร - มีบุตรจำนวน {data.childen_count} คน</strong>
                </p>
                <p>
                  <strong>กำลังศึกษา {data.children_studying} คน</strong>
                </p>
              </div>
              <div style={{ margin: "2rem 0" }}>
                <p>
                  <strong>
                    จำนวนบุตรอายุต่ำกว่า 6 ปี {data.child_baby_count} คน
                  </strong>
                </p>
                <p>
                  <strong>วันเดือนปีเกิดของบุตรที่อายุต่ำกว่า 6 ปี </strong>
                </p>
                <ol style={{ margin: "0" }}>
                  {data.child_birth.map((child, index) => (
                    <li key={index}>เกิดวันที่ {formatDate(child)}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          {status === "โสด"}
          {status === "หมั้น"}
          {status === "หย่าล้าง"}
          {status === "หม้าย"}
          {status === "Separated"}
        </div>
      )}
    </div>
  );
}
