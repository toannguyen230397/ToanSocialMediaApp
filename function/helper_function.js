import Toast from 'react-native-toast-message';

export const ShowToast = (type, text1, text2) => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
    });
}

export const formatTimestamp = (timestamp) => {
  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  // Tính toán số lượng ngày chênh lệch
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference >= 7) {
    // Nếu hơn một tuần, hiển thị ngày tháng dạng dd-mm-yy
    const date = new Date(timestamp);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear().toString().slice(-2)}`;
    return formattedDate;
  } else if (daysDifference > 0) {
    // Hiển thị x ngày trước
    return `${daysDifference} ngày trước`;
  } else {
    // Tính toán số lượng giờ chênh lệch
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference > 0) {
      // Hiển thị x tiếng trước
      return `${hoursDifference} tiếng trước`;
    } else {
      // Tính toán số lượng phút chênh lệch
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));

      if (minutesDifference > 0) {
        // Hiển thị x phút trước
        return `${minutesDifference} phút trước`;
      } else {
        // Hiển thị "mới đây"
        return 'mới đây';
      }
    }
  }
}
