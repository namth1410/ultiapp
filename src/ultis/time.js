export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
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

export const convertISOToCustomFormat = (isoString) => {
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
