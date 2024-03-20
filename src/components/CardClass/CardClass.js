import { Card, Tag } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function CardClass({ props }) {
  const { id, nameClass, members, nameCreator } = props;

  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(`/class/${id}`);
      }}
      style={{ cursor: "pointer", border: "none", backgroundColor: "unset" }}
    >
      <Card
        title={nameClass}
        style={{
          width: 300,
        }}
      >
        <Tag color="#108ee9">{`${members?.length || 0} thành viên`}</Tag>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "35px",
            width: "100%",
            fontFamily: "Gilroy",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>Người tạo:</span>
            <span style={{ fontWeight: "bold" }}>{nameCreator}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>Mã lớp:</span>
            <span style={{ fontWeight: "bold" }}>{id}</span>
          </div>
        </div>
      </Card>
    </button>
  );
}

CardClass.propTypes = {
  props: PropTypes.object,
  id: PropTypes.string,
  nameClass: PropTypes.string,
  members: PropTypes.array,
  nameCreator: PropTypes.string,
};

export default CardClass;
