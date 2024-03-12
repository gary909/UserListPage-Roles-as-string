import { useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { listUsers } from "../../features/user/userActions";
import { resetUserError } from "../../features/user/userSlice";
import ButtonReset from "../../components/ButtonReset";

const UserListPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { userInfo, userList, userLoading, userError } = useAppSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  useEffect(() => {
    userInfo?.role === "admin"
      ? dispatch(listUsers())
      : navigate("/unauthorized");
    return () => {
      dispatch(resetUserError());
    };
  }, [dispatch, navigate, userInfo]);

  return (
    <Container className="d-flex mt-5 flex-column justify-content-start align-items-center">
      <p className="h1 mb-4">{t("pages.userList.pageTitle")}</p>
      {userLoading ? (
        <Loader />
      ) : userError ? (
        <>
          <Message variant="danger">{userError}</Message>
          <ButtonReset
            reset={() => {
              dispatch(resetUserError());
              dispatch(listUsers());
            }}
          />
        </>
      ) : (
        userList && (
          <Container className="bg-white mt-4 p-3 rounded-2">
            <Table striped hover bordered className="mt-4">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">{t("pages.userList.name")}</th>
                  <th scope="col">{t("pages.userList.email")}</th>
                  <th scope="col">ROLE</th> 
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto: ${user.email}`}>{user.email}</a>
                    </td>
                    <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td> {/* Display role in text */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        )
      )}
    </Container>
  );
};

export default UserListPage;
