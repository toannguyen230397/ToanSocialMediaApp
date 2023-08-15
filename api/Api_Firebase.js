import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from '../firebaseconfig'
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, orderBy, where, query, updateDoc, arrayUnion, arrayRemove, onSnapshot, select } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Directions } from "react-native-gesture-handler"
import { ShowToast } from '../function/helper_function';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const imageName = Date.now().toString();
const storageRef = ref(storage, 'AvatarUsers/' + imageName);

/* API dùng để đăng ký tài khoản*/
export const Firebase_Register = async (email, password, name, avatar, selectedId, province, province_code, district, district_code, navigation, Alert, setLoading) => {
  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (avatar !== '') {
      const response = await fetch(avatar);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await setDoc(doc(firestore, 'Users', user.email), {
        uid: user.email,
        name: name,
        avatar: url,
        sex: selectedId,
        province: province,
        province_code: province_code,
        district: district,
        district_code: district_code,
        friendlist: [],
        waiting: [],
        notification: [],
        online: false,
      });
      console.log('Đăng ký thành công!');
      ShowToast('success', 'Thông Báo', 'Đăng ký thành công!');
    } else {
      await setDoc(doc(firestore, 'Users', user.email), {
        uid: user.email,
        name: name,
        avatar: '',
        sex: selectedId,
        province: province,
        district: district,
        friendlist: [],
        waiting: [],
        notification: [],
      });
      console.log('Đăng ký thành công!');
      ShowToast('success', 'Thông Báo', 'Đăng ký thành công!');
    }
    navigation.goBack();
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/email-already-in-use') {
      Alert.alert("Thông báo", "Email này đã được đăng ký bời người khác");
    } else if (errorCode === 'auth/invalid-email') {
      Alert.alert("Thông báo", "Email không hợp lệ");
    } else if (errorCode === 'auth/missing-password') {
      Alert.alert("Thông báo", "Chưa nhập mật khẩu");
    } else {
      Alert.alert(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};

/* Api này dùng để đăng nhập */
export const Firebase_Login = (email, password, navigation, Alert, setLoading, setEmail, setPassword) => {
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      const docRef = doc(firestore, 'Users', user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Lấy dữ liệu từ tài liệu
        const userdata = docSnap.data();
        await updateDoc(docRef, {
          online: true,
        });
        navigation.replace('Root', { userdata: userdata });
        setEmail('');
        setPassword('');
        console.log("User is login!");
      } else {
        console.log("Document does not exist!");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        Alert.alert("Thông báo", "Sai mật khẩu");
      } else if (errorCode === 'auth/user-not-found') {
        Alert.alert("Thông báo", "Tài khoản không tồn tại");
      } else if (errorCode === 'auth/invalid-email') {
        Alert.alert("Thông báo", "Email không hợp lệ");
      } else if (errorCode === 'auth/missing-password') {
        Alert.alert("Thông báo", "Chưa nhập mật khẩu");
      } else {
        Alert.alert(errorMessage);
      }
    })
    .finally(() => {
      setLoading(false);
    });
}

/* Api này dùng để đăng bài viết*/
export const Firebase_CreatePost = async (title, image, uid, feeling) => {
  try {
    const PostID = uid + '-' + Date.now().toString();
    const timestamp = Date.now();
    const urls = [];
    if (image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        const response = await fetch(image[i]);
        const blob = await response.blob();
        const imageName = Date.now().toString() + '_' + i.toString(); // Tạo tên độc đáo cho từng ảnh
        const storageRef = ref(storage, 'PostImages/' + imageName);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        urls.push(downloadURL);
      }
      console.log(urls); // In ra mảng các URL tải xuống
    }
    await setDoc(doc(firestore, 'NewFeeds', PostID), {
      postid: PostID,
      title: title,
      image: urls,
      postby: uid,
      feeling: feeling,
      posttime: timestamp,
      comment: [],
      like: [],
    });
    await sendNotificationToFriendlist(uid, title, PostID);
    console.log('Đăng bài thành công!');
    ShowToast('success', 'Thông Báo', 'Đăng bài thành công!');
  } catch (error) {
    ShowToast('error', 'Thông Báo', 'Đăng bài không thành công!');
  }
};

/* Api này dùng để lấy dữ liệu cho NewFeeds*/
export const getDataNewFeeds = async (setDatas, uid) => {
  const q = query(collection(firestore, "NewFeeds"));
  const querySnapshot = await getDocs(q);
  const datas = [];

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const postby = data.postby;
      const q2 = query(
        collection(firestore, "Users"),
        where("uid", "==", postby)
      );
      const querySnapshot2 = await getDocs(q2);

      await Promise.all(
        querySnapshot2.docs.map((doc) => {
          const data2 = doc.data();
          data.uid = data2.uid;
          data.name = data2.name;
          data.avatar = data2.avatar;
        })
      );
      datas.push(data);
    })
  );

  datas.sort((a, b) => a.posttime - b.posttime);
  datas.reverse();
  console.log('getDataNewFeeds Lấy dữ liệu Newfeeds thành công!');
  setDatas(datas);
};

/* Api này dùng để lấy dữ liệu cho bài đăng của user*/
export const getDataUserFeeds = async (setDatas, uid) => {
  const q = query(
    collection(firestore, "NewFeeds"),
    where("postby", "==", uid)
  );
  const querySnapshot = await getDocs(q);
  const datas = [];

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const q2 = query(
        collection(firestore, "Users"),
        where("uid", "==", uid)
      );
      const querySnapshot2 = await getDocs(q2);

      await Promise.all(
        querySnapshot2.docs.map((doc) => {
          const data2 = doc.data();
          data.uid = data2.uid;
          data.name = data2.name;
          data.avatar = data2.avatar;
        })
      );
      datas.push(data);
    })
  );

  datas.sort((a, b) => a.posttime - b.posttime);
  datas.reverse();
  console.log('getDataUserFeeds lấy dữ liệu Newfeeds của user thành công!');
  setDatas(datas);
};

/* Api này dùng để lấy dữ liệu album của user*/
export const getDataAlbum = async (setDatas, uid) => {
  const q = query(
    collection(firestore, "NewFeeds"),
    where("postby", "==", uid)
  );
  const querySnapshot = await getDocs(q);
  const datas = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const fielddata = data.image;
    datas.push(...fielddata);
  });
  datas.reverse();
  setDatas(datas);
};

/* Api này dùng để lấy dữ liệu của tất cả user*/
export const getDataUsers = async (setDatas, uid) => {
  const q = query(
    collection(firestore, "Users"),
    where("uid", "!=", uid)
  );
  const querySnapshot = await getDocs(q);
  const datas = [];
  querySnapshot.forEach((doc) => {
    datas.push(doc.data());
  });
  setDatas(datas);
};

/* Api này dùng để lấy dữ liệu của user*/
export const getDataUser = async (setDatas, uid, setIsLoading) => {
  const q = query(
    collection(firestore, "Users"),
    where("uid", "==", uid)
  );
  const querySnapshot = await getDocs(q);
  const datas = [];
  querySnapshot.forEach((doc) => {
    datas.push(doc.data());
  });
  console.log('getDataUser Lấy dữ liệu user thành công!');
  setDatas(datas);
  setIsLoading(false);
};

/* Api này dùng để thêm like*/
export const handlerLike = async (postId, uid) => {
  const docRef = doc(firestore, "NewFeeds", postId);
  await updateDoc(docRef, {
    like: arrayUnion(uid)
  });

  console.log("Liked successfully!");
}

/* Api này dùng để bỏ like*/
export const handlerNoLike = async (postId, uid) => {
  const docRef = doc(firestore, "NewFeeds", postId);
  await updateDoc(docRef, {
    like: arrayRemove(uid)
  });

  console.log("Liked successfully!");
}

/* Api này dùng để lấy dữ liệu realtime bình luận của bài viết*/
export const getDataComment = async (setDatas, postid) => {
  const q = query(
    collection(firestore, "NewFeeds"),
    where("postid", "==", postid)
  );

  onSnapshot(q, async (querySnapshot) => {
    const newdata = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const comments = data.comment || [];
        const uids = comments.map((comment) => comment.uid);

        if (uids.length > 0) {
          const q2 = query(
            collection(firestore, "Users"),
            where("uid", "in", uids)
          );
          const querySnapshot2 = await getDocs(q2);

          comments.forEach((comment) => {
            const userData = querySnapshot2.docs.find(
              (doc) => doc.data().uid === comment.uid
            );

            if (userData) {
              const userData2 = userData.data();
              const newComment = { ...comment };
              newComment.name = userData2.name;
              newComment.avatar = userData2.avatar;
              newdata.push(newComment);
            }
          });
        }
      })
    );

    newdata.reverse();
    setDatas(newdata);
    console.log('getDataComment lấy dữ liệu bình luận bài viết thành công!');
  });
};

/* Api này dùng để thêm bình luận vào bài viết*/
export const handlerComment = async (postId, uid, title) => {
  const docRef = doc(firestore, "NewFeeds", postId);
  const timestamp = Date.now();
  await updateDoc(docRef, {
    comment: arrayUnion({ uid: uid, title: title, posttime: timestamp })
  });

  console.log("Upload comment successfully!");
}

/* Api này dùng để lấy dữ liệu bạn bè của user*/
export const getDataFriendlist = async (setDatas, uid) => {
  const q = query(
    collection(firestore, "Users"),
    where("uid", "==", uid)
  );
  const querySnapshot = await getDocs(q);
  const friendlist = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const fielddata = data.friendlist;
    friendlist.push(...fielddata);
  });
  if(friendlist.length > 0)
  {
    const q2 = query(
      collection(firestore, "Users"),
      where("uid", "in", friendlist)
    );

    onSnapshot(q2, async (querySnapshot) => {
      const friendlistData = [];
      querySnapshot.docs.map(async (doc) => {
        const data2 = doc.data();
        friendlistData.push(data2);
      })
      console.log('friendlistData lấy dữ liệu danh sách bạn bè thành công!');
      friendlistData.sort((a, b) => a.name.localeCompare(b.name));
      friendlistData.sort((a, b) => (b.online || 0) - (a.online || 0));
      setDatas(friendlistData);
    });
  }
};

/* Api này dùng để tạo room chat*/
export const createMessegeRoom = async (roomid, uid, Selectuid) => {
  const roomDocRef = doc(firestore, 'Messege', roomid);

  try {
    const roomDocSnapshot = await getDoc(roomDocRef);

    if (roomDocSnapshot.exists()) {
      console.log('Room already exists.'); // Đã có phòng chat với roomid này
      return;
    }
    else {
      await setDoc(roomDocRef, {
        roomid: roomid,
        members: [uid, Selectuid],
        online: [uid],
        lastmesseges: {},
        messeges: [],
      });
    }
    console.log('Room created successfully.'); // Phòng chat được tạo thành công
  } catch (error) {
    console.error('Error creating room:', error); // Lỗi khi tạo phòng chat
  }
};

/* Api này dùng để gửi tin nhắn*/
export const handlerMessege = async (roomid, uid, messege, type) => {
  const docRef = doc(firestore, "Messege", roomid);
  const timestamp = Date.now();
  await updateDoc(docRef, {
    messeges: arrayUnion({ uid: uid, messege: messege, posttime: timestamp, type: type })
  });
  await updateDoc(docRef, {
    lastmesseges: { uid: uid, messege: messege, posttime: timestamp, type: type },
  });
  console.log("Upload messege successfully!");
}

/* Api này dùng để lấy dữ liệu realtime của last messeges*/
export const getDataLastMesseges = async (setDatas, uid, setLoading) => {
  setLoading(true);
  const q = query(
    collection(firestore, "Messege"),
    where("members", "array-contains", uid)
  );
  onSnapshot(q, async (querySnapshot) => {
    const newdata = [];
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const filteredMembers = data.members.filter((item) => item !== uid);
        const filteruid = filteredMembers[0];
        const q2 = query(
          collection(firestore, "Users"),
          where("uid", "==", filteruid)
        );
        const querySnapshot2 = await getDocs(q2);

        const promises = querySnapshot2.docs.map((doc) => {
          const data2 = doc.data();
          data.uid = data2.uid;
          data.name = data2.name;
          data.avatar = data2.avatar;
          data.online = data2.online;
        });

        await Promise.all(promises);
        newdata.push(data);
      })
    );
    newdata.sort((a, b) => a.posttime - b.posttime);
    setDatas(newdata);
    setLoading(false);
  });
};

/* Api này dùng để lấy dữ liệu realtime của messeges*/
export const getDataListMesseges = async (setDatas, roomid) => {
  const q = query(
    collection(firestore, "Messege"),
    where("roomid", "==", roomid)
  );

  onSnapshot(q, (querySnapshot) => {
    const newdata = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const messeges = data.messeges || [];
      newdata.push(...messeges);
    });
    newdata.reverse();
    setDatas(newdata);
  });
};

/* Api này dùng để chỉnh sửa thông tin user*/
export const handerEditProfile = (email, password, avatar, name, newPassword, province, province_code, district, district_code, selectedId, Alert, navigation, setLoading) => {
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      updatePassword(auth.currentUser, newPassword)
        .then(async () => {
          const response = await fetch(avatar);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);

          const docRef = doc(firestore, "Users", email);
          await updateDoc(docRef, {
            avatar: url,
            name: name,
            province: province,
            province_code: province_code,
            district: district,
            district_code: district_code,
            sex: selectedId
          });
        }).then(() => {
          setLoading(false);
          Alert.alert("Thông báo", "Cập nhật thông tin thành công, đăng nhập lại để xem thay đổi?", [
            { text: "YES", onPress: () => navigation.popToTop() }
          ]);
        })
        .catch((error) => {
          Alert.alert('Lỗi', error.message);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        Alert.alert('Thông báo', 'Sai mật khẩu');
      } else if (errorCode === 'auth/user-not-found') {
        Alert.alert('Thông báo', 'Tài khoản không tồn tại');
      } else if (errorCode === 'auth/invalid-email') {
        Alert.alert('Thông báo', 'Email không hợp lệ');
      } else if (errorCode === 'auth/missing-password') {
        Alert.alert('Thông báo', 'Chưa nhập mật khẩu');
      } else {
        Alert.alert('Lỗi', errorMessage);
      }
    });
}

/* Api này dùng để gửi thông báo*/
export const handlerNotification = async (sendby, sendto, title, postid, type) => {
  const docRef = doc(firestore, "Users", sendto);
  const timestamp = Date.now();
  await updateDoc(docRef, {
    notification: arrayUnion({ sendby: sendby, sendto: sendto, title: title, postid: postid, posttime: timestamp, readed: false, type: type })
  }).then(console.log('send notification success'));
}

/* Api này dùng để xóa thông báo*/
export const handlerRemoveNotification = async (uid, postid) => {
  const docRef = doc(firestore, "Users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const notificationData = docSnap.data().notification;
    await updateDoc(docRef, {
      notification: notificationData.filter(notification => notification.postid != postid)
    }).then(console.log('remove notification success'));
  } else {
    console.log('User does not exist');
  }
}

/* Api này dùng để lấy dữ liệu realtime thông báo*/
export const getDataNotification = async (setNotification, setNotificationLength, uid) => {
  const q = query(
    collection(firestore, "Users"),
    where("uid", "==", uid)
  );

  onSnapshot(q, async (querySnapshot) => {
    const newdata = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const notification = data.notification || [];
        const sendbyid = notification.map((item) => item.sendby);
        const notread = notification.filter((item) => item.readed === false);
        const notreadLength = notread.length;
        setNotificationLength(notreadLength);

        if (sendbyid.length > 0) {
          const q2 = query(
            collection(firestore, "Users"),
            where("uid", "in", sendbyid)
          );
          const querySnapshot2 = await getDocs(q2);

          notification.forEach((notification) => {
            const userData = querySnapshot2.docs.find(
              (doc) => doc.data().uid === notification.sendby
            );

            if (userData) {
              const userData2 = userData.data();
              const newMotification = { ...notification };
              newMotification.sendbyName = userData2.name;
              newMotification.sendbyAvatar = userData2.avatar;
              newdata.push(newMotification);
            }
          });
        }
      })
    );
    newdata.sort((a, b) => a.posttime - b.posttime);
    newdata.reverse();
    setNotification(newdata);
  });
};

/* Api này dùng để cập nhật đã xem thông báo*/
export const handlerReadNotification = async (uid) => {
  const docRef = doc(firestore, "Users", uid);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const notificationArray = docSnapshot.data().notification;

    // Cập nhật trường "readed" của tất cả các phần tử trong mảng thành true
    const updatedNotificationArray = notificationArray.map(notification => {
      return { ...notification, readed: true };
    });

    await updateDoc(docRef, { notification: updatedNotificationArray });
    console.log('notification is readed');
  } else {
    console.log('User document does not exist');
  }
}

/* Api này dùng kiểm tra mỗi quan hệ*/
export const checkFriendship = async (uid1, uid2, setStatus) => {
  if(uid1 != uid2)
  {
    const q = query(
      collection(firestore, "Users"),
      where("uid", "==", uid1)
    );

    const q2 = query(
      collection(firestore, "Users"),
      where("uid", "==", uid2)
    );

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        onSnapshot(q2, (querySnapshot2) => {
          querySnapshot2.forEach((doc2) => {
            const userData2 = doc2.data();
            if (userData.waiting.includes(uid2))
            {
              setStatus('Đang chờ phản hồi từ bạn');
            }
            else if (userData2.friendlist.includes(uid1)) {
              setStatus('Bạn bè');
            } else if (userData2.waiting.includes(uid1)) {
              setStatus('Đã gửi lời mời kết bạn');
            } else {
              setStatus('Gửi lời kết bạn');
            }
          });
        });

      });
    });
  }
}

/* Api này dùng để lấy dữ liệu cho bài viết*/
export const getDataDetaiFeed = async (setDatas, setImages, setLoading, postid) => {
  const q = query(
    collection(firestore, "NewFeeds"),
    where("postid", "==", postid)
    );
  const querySnapshot = await getDocs(q);
  const datas = [];

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const postby = data.postby;
      setImages(data.image);
      const q2 = query(
        collection(firestore, "Users"),
        where("uid", "==", postby)
      );
      const querySnapshot2 = await getDocs(q2);

      await Promise.all(
        querySnapshot2.docs.map((doc) => {
          const data2 = doc.data();
          data.uid = data2.uid;
          data.name = data2.name;
          data.avatar = data2.avatar;
        })
      );
      datas.push(data);
    })
  );
  console.log('getDataDetaiFeed Lấy dữ liệu bài viết thành công!');
  setDatas(datas);
  setLoading(false);
};

/* Api này dùng để gửi yêu cầu kết bạn*/
export const handlerFriendRequest = async (status, uid, uid2) => {
  const docRef = doc(firestore, "Users", uid);
  const postid = uid2+'-'+uid;
  if(status == 'Gửi lời kết bạn')
  {
    await updateDoc(docRef, { waiting: arrayUnion(uid2) });
    handlerNotification(uid2, uid, 'Đã gửi lời mời kết bạn', postid, 'friendRequest');
    console.log('send request success');
  }
  else if(status == 'Đã gửi lời mời kết bạn')
  {
    await updateDoc(docRef, { waiting: arrayRemove(uid2) });
    handlerRemoveNotification(uid, postid);
    console.log('remove request success');
  }
  else
  {
    null;
  }
}

/* Api này dùng để phản hồi yêu cầu kết bạn*/
export const responeFriendRequest = async (response, uid, uid2, uid2Name, postid, setIsLoading) => {
  setIsLoading(true);
  const docRef = doc(firestore, "Users", uid);
  const docRef2 = doc(firestore, "Users", uid2);
  const timestamp = Date.now();
  const newPostid = uid+'-'+timestamp;
  handlerRemoveNotification(uid, postid);
  if(response == 'argee')
  {
    await updateDoc(docRef, { friendlist: arrayUnion(uid2), waiting: arrayRemove(uid2) });
    await updateDoc(docRef2, { friendlist: arrayUnion(uid) });
    handlerNotification(uid, uid2, 'Đã đồng ý lời mời kết bạn của bạn', newPostid, 'responeRequest');
    setIsLoading(false);
    ShowToast('success', 'Thông Báo', 'Bạn đã trở thành bạn bè của '+uid2Name);
  }
  else
  {
    await updateDoc(docRef, { waiting: arrayRemove(uid2) });
    handlerNotification(uid, uid2, 'Đã từ chối lời mời kết bạn của bạn', newPostid, 'responeRequest');
    setIsLoading(false);
    ShowToast('error', 'Thông Báo', 'Bạn đã từ chối lời kết bạn của '+uid2Name);
  }
}

/* Api này dùng để hủy kết bạn*/
export const handlerUnfriend = async (uid, uid2, setLoading) => {
  setLoading(true);
  const docRef = doc(firestore, "Users", uid);
  const docRef2 = doc(firestore, "Users", uid2);
  
  await updateDoc(docRef, { friendlist: arrayRemove(uid2) });
  await updateDoc(docRef2, { friendlist: arrayRemove(uid) });
  ShowToast('success', 'Thông Báo', 'Hủy kết bạn thành công!');
  setLoading(false);
}

/* Api này dùng để lấy dữ liệu bạn bè của user*/
export const sendNotificationToFriendlist = async (uid, title, PostID) => {
  const q = query(
    collection(firestore, "Users"),
    where("uid", "==", uid)
  );
  const querySnapshot = await getDocs(q);
  const friendlist = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const fielddata = data.friendlist;
    friendlist.push(...fielddata);
  });

  if(friendlist.length > 0)
  {
    for (let i = 0; i < friendlist.length; i++) {
      const timestamp = Date.now();
      handlerNotification(uid, friendlist[i], 'đã đăng một bài viết mới: '+title, PostID, 'post');
    }
  }
  else
  {
    console.log('Không có bạn bè');
  }
};

/* Api này dùng để cập nhật trạng thái online và offline của user*/
export const handlerOnline = async (state) => {
  const storedUid = await AsyncStorage.getItem('uid');
  if(storedUid)
  {
    const docRef = doc(firestore, "Users", storedUid);
    await updateDoc(docRef, {
      online: state == 'active' ? true : false,
    });

    state == 'active' ? console.log("User is online now!") : console.log("User is offline now!");
  }
}

/* Api này dùng để cập nhật những thành viên nào đang có mặt trong phòng chat*/
export const handlerUpdateMemberOnline = async (roomid, uid, state) => {
  const docRef = doc(firestore, "Messege", roomid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if(state == 'active')
    {
      await updateDoc(docRef, {
        online: arrayUnion(uid)
      });
    }
    else
    {
      await updateDoc(docRef, {
        online: arrayRemove(uid)
      });
    }
    console.log("Upload member online of chat room successfully!");
  }
}