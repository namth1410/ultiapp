export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export const convertDurationToStringV2 = (duration) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút ${seconds} giây`;
  } else if (minutes > 0) {
    return `${minutes} phút ${seconds} giây`;
  } else {
    return `${seconds} giây`;
  }
};

export const convertDurationToString = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  if (minutes === 0) {
    return `${seconds} giây`;
  } else if (seconds === 0) {
    return `${minutes} phút`;
  } else {
    return `${minutes} phút ${seconds} giây`;
  }
};

export const convertDurationToStringV1 = (isoString) => {
  const duration = (new Date() - new Date(isoString)) / 1000;

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60) % 60;

  if (duration < 60) {
    return "Vừa xong";
  } else if (duration < 3600) {
    return `${minutes} phút trước`;
  } else {
    return `${hours} giờ trước`;
  }
};

export const convertISOToCustomFormat = (isoString) => {
  if (!isoString) return "--/--/----";
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "pm" : "am";

  // Định dạng tháng và ngày thành dạng dd/MM/yyyy
  const formattedDate = `${day}/${month < 10 ? "0" + month : month}/${year}`;

  // Định dạng giờ theo 12 giờ và thêm vào 'am' hoặc 'pm'
  let formattedHours = hours % 12;
  formattedHours = formattedHours ?? 12; // Nếu là 0 thì chuyển thành 12
  const formattedTime = `${formattedHours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
};
