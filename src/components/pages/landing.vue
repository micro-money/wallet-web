<template>
  <div class="content">
    <el-row
      type="flex"
      class="row-bg"
      justify="space-between">
      <el-col
        :xs="24"
        :sm="16"
        :md="12"
        :lg="12"
        :xl="12"
        class="intro">
        <div class="title">
          Safe Joint Between Your Cash and Crypto World
        </div>

        <div class="description">
          Fully reserved fiat- and cryptocurrencies-pegged tokens securely hedging your funds.
        </div>

        <img
          class="macbook-small"
          src="../../assets/images/macbook.png">
      </el-col>

      <el-col
        :xs="0"
        :sm="8"
        :md="12"
        :lg="12"
        :xl="12">
        <img
          srcset="../../assets/images/macbook.png 300w,
                  ../../assets/images/macbook.png 1440w,
                  ../../assets/images/macbook.png 1920w,
                  ../../assets/images/macbook.png 2560w"
          sizes="(max-width: 1025px) 600px,
                 (max-width: 1920px) 1178px,
                 1767px,
                 1767px"
          src="../../assets/images/macbook.png"
          class="macbook">
      </el-col>
    </el-row>

    <el-row>
      <el-col
        :span="24"
        class="info"/>
    </el-row>
  </div>
</template>

<style lang="scss">
@import "../../assets/partials/variables";

.app-wrapper {

  &.landing {
    background-image: linear-gradient(66deg, #01080d, #061921 26%, #0d3440 65%, #0e3744 70%, #144b5b);

    .header {
      @media (max-width: 479px) {
        padding: 0 0;
      }
    }

    .view-container {
      overflow: hidden;
      padding: 20px 0;

      .content {
        color: #fff;
        width: 100%;

        .intro {
          height: 616px;
          padding: 0 120px;

           @media (min-width: 481px) and (max-width: 1025px) {
              padding: 0 80px;
           }

           @media (max-width: 480px) {
              padding: 0 30px;
           }

          .title {
            margin-top: 194px;
            font-size: 52px;
            font-weight: 500;

            @media (min-width: 1025px) and (max-width: 1366px) {
                margin-top: 160px;
                font-size: 44px;
            }

            @media (min-width: 768px) and (max-width: 1025px) {
                margin-top: 110px;
                font-size: 44px;
            }

            @media (min-width: 411px) and (max-width: 767px) {
                margin-top: 50px;
                font-size: 30px;
            }

             @media (max-width: 410px) {
                margin-top: 10px;
                font-size: 30px;
            }
          }

          .description {
            margin-top: 30px;
            font-size: 26px;
            font-weight: 400;
            opacity: 0.7;

            @media (max-width: 1025px) {
                font-size: 18px;
            }
          }
        }

        .macbook {
          object-fit: contain;
          position: absolute;
          top: 113px;
          right: -13px;
          width: 40%;
        }

        .info {
          height: 329px;
          opacity: 0.85;
        }

        .macbook-small {
          display: none;

          @media (max-width: 768px) {
            display: block;
            position: absolute;
            right: -13px;
            margin-top: 50px;
            width: 70%;
          }
        }
      }
    }
  }
}
</style>
