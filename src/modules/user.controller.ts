import bycrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import myResponse from "../utils/Response";
import { generateToken, verifyToken } from "../service/jwtService";
import { sentOtpByEmail } from "../service/sendMail";
// import { generateKey } from "crypto";
const prisma = new PrismaClient();

const signUp = async (req: Request, res: Response) => {
  try {
    let {
      name,
      email,
      password,
      role,
    }: { name: string; email: string; password: string; role: string } =
      req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "All fields are required",
        })
      );
    }
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (user) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "User already exists",
        })
      );
    }
    password = await bycrypt.hash(password, 10);

    const oneTimeCode =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    try {
      sentOtpByEmail(email, oneTimeCode);
    } catch (error) {
      console.error("Failed to send OTP: ", error);
    }
    if (!oneTimeCode) return;
    const userCreate = await prisma.user.create({
      data: { name, email, password, role, oneTimeOtp: oneTimeCode },
    });
    setTimeout(async () => {
      try {
        await prisma.user.update({
          where: {
            id: userCreate.id,
          },
          data: {
            oneTimeOtp: null,
          },
        });
        console.log("oneTimeCode reset to null after 3 minutes");
      } catch (error) {
        console.error("Error updating oneTimeCode:", error);
      }
    }, 180000);
    generateToken({ id: userCreate.id, name, email, role });

    setTimeout(async () => {
      await prisma.user.update({
        where: { email: email },
        data: {
          isEmailVerified: true,
          oneTimeOtp: null,
        },
      });
    }, 180000);
    res.status(200).json(
      myResponse({
        statusCode: 200,
        status: "success",
        message: "A verification email is sent to your email",
        data: userCreate,
      })
    );
  } catch (error) {
    console.error("Error in signUp controller:", error);
    res.status(500).json(
      myResponse({
        statusCode: 500,
        status: "failed",
        message: "Internal Server Error",
      })
    );
  }
};

// Login
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new Error(`Provide Valid User Details`);
  // User Data Check
  const validUser: any = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!validUser) {
    return res.status(404).json(
      myResponse({
        statusCode: 404,
        status: "failed",
        message: "User not found",
      })
    );
  }
  const validPassword = await bycrypt.compare(password, validUser.password);
  if (validUser && validPassword) {
    generateToken({
      email: validUser.email,
      id: validUser.id,
      role: validUser.role,
      name: validUser.name,
    });
    // console.log('token',generateToken(res, validUser.email))

    res.status(200).json(
      myResponse({
        status: "success",
        statusCode: 200,
        data: {
          email: validUser.email,
          id: validUser.id,
          role: validUser.role,
          name: validUser.name,
        },
      })
    );
  } else {
    res
      .status(400)
      .send({
        status: "failed",
        statusCode: 400,
        message: "Invalid User Information",
      });
    // throw new Error(`Invalid User Details`);
  }
};

const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    // Check if all fields are provided

    if (!email || !code) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "All fields are required",
        })
      );
    }
    // Fetch user from database
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    // Handle case where user is not found
    if (!user) {
      return res.status(404).json(
        myResponse({
          statusCode: 404,
          status: "failed",
          message: "User not found",
        })
      );
    }
    console.log(user, code);
    // Verify the code
    if (user.oneTimeOtp === parseFloat(code)) {
      await prisma.user.update({
        where: { email: email },
        data: {
          isEmailVerified: true,
          oneTimeOtp: null,
        },
      });

      // Generate token
      const accessToken = generateToken({
        email: user.email,
        id: Number(user.id), // Assuming user.id is the correct property
        name: user.name,
        role: user.role,
      });
      // Respond with success
      res.status(200).json(
        myResponse({
          statusCode: 200,
          status: "success",
          message: "User verified successfully",
          data: {
            token: accessToken,
          },
        })
      );
    } else {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "Invalid code",
        })
      );
    }
  } catch (error) {
    console.error("Error in verifyCode controller:", error);
    res.status(500).json(
      myResponse({
        statusCode: 500,
        status: "failed",
        message: "Internal Server Error",
      })
    );
  }
};

const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "Email are required",
        })
      );
    }

    const user: any = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "User not found",
        })
      );
    }

    // Generate a new OTP
    const oneTimeCode =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    if (user.oneTimeCode === null) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "OTP already sent",
        })
      );
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        isEmailVerified: true,
        oneTimeOtp: null,
      },
    });

    await sentOtpByEmail(email, oneTimeCode);

    res.status(200).json(
      myResponse({
        statusCode: 200,
        status: "success",
        message: "OTP has been resent successfully",
      })
    );
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json(
      myResponse({
        statusCode: 500,
        status: "Failed",
        message: "Failed to resend OTP",
      })
    );
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "Email are required",
        })
      );
    }
    const user: any = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "User not found",
        })
      );
    }

    const oneTimeCode =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    try {
      sentOtpByEmail(email, oneTimeCode);
    } catch (error) {
      console.error("Failed to send verification email", error);
      throw new Error("Error creating user");
    }
    await prisma.user.update({
      where: { email: email },
      data: {
        isEmailVerified: true,
        oneTimeOtp: oneTimeCode,
      },
    });
    res.status(200).json(
      myResponse({
        statusCode: 200,
        status: "success",
        message: "A verification code is sent to your email",
      })
    );
  } catch (error: any) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json(
      myResponse({
        statusCode: 500,
        message: `Internal server error ${error.message}`,
        status: "Failed",
      })
    );
  }
};

const setPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "Token or password are required",
        })
      );
    }
    const userData = verifyToken(token);

    console.log("userData", userData);
    if (!userData) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "Invalid token",
        })
      );
    }

    const expireDate = new Date(userData.exp * 1000);
    if (expireDate < new Date()) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "Token expired",
        })
      );
    }

    const user = await prisma.user.findFirst({
      where: { id: userData.id },
    });

    console.log(user);
    if (!user) {
      return res.status(400).json(
        myResponse({
          statusCode: 400,
          status: "failed",
          message: "User not found",
        })
      );
    }
    let hashedPassword = await bycrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json(
      myResponse({
        statusCode: 200,
        status: "success",
        message: "Password has been set successfully",
      })
    );
  } catch (error: any) {
    console.error("Error in setPassword controller:", error);
    res.status(500).json(
      myResponse({
        statusCode: 500,
        message: `Internal server error ${error.message}`,
        status: "Failed",
      })
    );
  }
};

export { signUp, verifyCode, resendOtp, forgotPassword, setPassword,loginUser };
